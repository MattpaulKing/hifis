// RESIZE ITEM LOGIC
let initialSize = { width: 0, height: 0 };
let minSize: ItemSize;
let maxSize: ItemSize;
//
// $effect(() => {
//   if (gridSettings.itemSize) {
//     minSize = {
//       width: coordinate2size(item.min.w, gridSettings.itemSize.width, gridSettings.gap),
//       height: coordinate2size(item.min.h, gridSettings.itemSize.height, gridSettings.gap)
//     };
//     if (!item.max) return;
//     maxSize = {
//       width: coordinate2size(item.max.w, gridSettings.itemSize.width, gridSettings.gap),
//       height: coordinate2size(item.max.h, gridSettings.itemSize.height, gridSettings.gap)
//     };
//   }
// });

// let _resizable = $derived(!gridSettings.readOnly && item.resizeable);

// function resizeStart(event: PointerEvent) {
//   if (event.button !== 0) return;
//   event.stopPropagation();
//   initInteraction(event);
//   initialSize = { width, height };
//   window.addEventListener('pointermove', resize);
//   window.addEventListener('pointerup', resizeEnd);
// }
// function resize(event: PointerEvent) {
//   if (!gridSettings.itemSize) {
//     throw new Error('Grid is not mounted yet');
//   }
//   width = event.pageX + initialSize.width - initialPointerPosition.left;
//   height = event.pageY + initialSize.height - initialPointerPosition.top;
//   if (gridSettings.bounds && gridSettings.boundsTo) {
//     const parentRect = gridSettings.boundsTo.getBoundingClientRect();
//     if (width + left > parentRect.width) {
//       width = parentRect.width - left;
//     }
//     if (height + top > parentRect.height) {
//       height = parentRect.height - top;
//     }
//   }
//   if (minSize) {
//     width = Math.max(width, minSize.width);
//     height = Math.max(height, minSize.height);
//   }
//   if (item.max) {
//     width = Math.min(width, maxSize.width);
//     height = Math.min(height, maxSize.height);
//   }
//   if (gridSettings.collision === 'none') {
//     scroll;
//   }
//   // TODO: throttle this, hasColisions is expensive
//   const { w, h } = snapOnResize(width, height, previewItem, gridSettings);
//   if (gridSettings.collision !== 'none') {
//     resizePreviewWithCollisions(w, h);
//   } else {
//     if (!hasCollisions({ ...previewItem, w, h }, Object.values(gridSettings.items))) {
//       previewItem = { ...previewItem, w, h };
//     }
//   }
// }
function resizePreviewWithCollisionsWithPush(w: number, h: number) {
  handleCollisionsForPreviewItemWithPush({ w, h });
}
function resizePreviewWithCollisionsWithCompress(w: number, h: number) {
  const sizeChanged = w != previewItem.w || h != previewItem.h;
  if (sizeChanged) {
    const hGap = h - previewItem.h;
    previewItem = { ...previewItem, w, h };
    applyPreview();
    const collItems = getCollisions(
      { ...previewItem, w, h: 9999 },
      Object.values(gridSettings.items)
    );
    collItems.forEach((item) => {
      item.y += hGap;
    });
    compressItems();
  }
}
function resizePreviewWithCollisions(w: number, h: number) {
  if (gridSettings.collision === 'compress') {
    resizePreviewWithCollisionsWithCompress(w, h);
  } else {
    resizePreviewWithCollisionsWithPush(w, h);
  }
}
function resizeEnd(event: PointerEvent) {
  if (event.button !== 0) return;
  endInteraction(event);
  window.removeEventListener('pointermove', resize);
  window.removeEventListener('pointerup', resizeEnd);
}
function compressItems() {
  const gridItems = Object.values(gridSettings.items);
  const sortedItems = [...gridItems].sort((a, b) => a.y - b.y);
  sortedItems.reduce(
    (accItem, currentItem) => {
      if (currentItem.id === previewItem.id) {
        //if previewItem do nothing
      } else if (previewItem.y < currentItem.y + currentItem.h) {
        //compress items above previewItem
        const maxY =
          currentItem.y >= previewItem.y
            ? currentItem.y + previewItem.h + 1
            : previewItem.y + currentItem.h + 1;
        let newY = maxY;
        while (newY >= 0) {
          if (hasCollisions({ ...currentItem, y: newY }, accItem)) {
            break;
          }
          newY--;
        }
        currentItem.y = newY + 1;
        accItem.push(currentItem);
      } else {
        //compress items below previewItem
        let newY = currentItem.y;
        while (newY >= 0) {
          if (hasCollisions({ ...currentItem, y: newY }, accItem)) {
            break;
          }
          newY--;
        }
        if (newY < currentItem.y && newY > 0) {
          currentItem.y = newY + 1;
        }
        accItem.push(currentItem);
      }
      return accItem;
    },
    [previewItem]
  );
}

function updateCollItemPositionWithPush(collItem: LayoutItem, items: LayoutItem[]) {
  //TODO: This may need an actual reference
  const newPosition = getAvailablePosition(
    collItem,
    items,
    gridSettings.maxCols,
    gridSettings.maxRows
  );
  if (newPosition) {
    collItem.x = newPosition.x;
    collItem.y = newPosition.y;
  }
}
function handleCollisionsForPreviewItemWithPush(newAttributes: { x: number; y: number }) {
  const gridItems = Object.values(gridSettings.items);
  const itemsExceptPreview = gridItems.filter((item) => item.id != previewItem.id);
  const collItems = getCollisions({ ...previewItem, ...newAttributes }, itemsExceptPreview);
  collItems.forEach((collItem) => {
    const itemsExceptCollItem = gridItems.filter((item) => item.id != collItem.id);
    const items = [
      ...itemsExceptCollItem.filter((item) => item.id != previewItem.id),
      { ...previewItem, ...newAttributes }
    ];
    updateCollItemPositionWithPush(collItem, items);
  });
  previewItem = { ...previewItem, ...newAttributes };
  applyPreview();
}
function movePreviewWithCollisionsWithPush(x: number, y: number) {
  handleCollisionsForPreviewItemWithPush({ x, y });
}
function movePreviewWithCollisionsWithCompress(x: number, y: number) {
  const gridItems = Object.values(gridSettings.items);
  let newY = y;
  const itemsExceptPreview = gridItems.filter((item) => item.id != previewItem.id);
  while (newY >= 0) {
    const collItems = getCollisions({ ...previewItem, x, y: newY }, gridItems);
    if (collItems.length > 0) {
      const sortedItems = collItems.sort((a, b) => b.y - a.y);
      let moved = false;
      sortedItems.forEach((sortItem) => {
        //if you want to fix sensitivity of grid, change this statement
        if (y + previewItem.h / 2 >= sortItem.y + sortItem.h / 2) {
          moved = true;
          newY = sortItem.y + sortItem.h;
          sortedItems.forEach((item) => {
            if (
              !hasCollisions({ ...item, y: item.y - previewItem.h }, itemsExceptPreview) &&
              item.y - previewItem.h >= 0
            ) {
              item.y -= previewItem.h;
            }
          });
          return false;
        }
      });
      if (!moved) {
        newY = previewItem.y;
      }
      break;
    }
    newY--;
  }
  if (newY < 0 || y === 0) {
    newY = 0;
  }
  const positionChanged = x != previewItem.x || newY != previewItem.y;
  previewItem = { ...previewItem, x, y: newY };
  if (positionChanged) {
    // compressItems();
    applyPreview();
  }
}
function movePreviewWithCollisions(x: number, y: number) {
  if (gridSettings.collision === 'compress') {
    movePreviewWithCollisionsWithCompress(x, y);
  } else {
    movePreviewWithCollisionsWithPush(x, y);
  }
}
