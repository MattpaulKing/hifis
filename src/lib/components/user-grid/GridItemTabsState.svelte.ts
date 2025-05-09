export type TabEntity = { id: string, label: string, active: boolean, tabType: "entity-list" | "entity" | "new-entity" }

export default class {
  entities = $state<TabEntity[]>([])
  activeIdx = $derived(this.entities.findIndex(entity => entity.active) ?? 0)
  activeEntity = $derived(this.activeIdx >= 0 ? this.entities[this.activeIdx] : null)
  entityLabel: string;
  constructor({ entities, entityLabel }: { entities: TabEntity[], entityLabel: string }) {
    this.entityLabel = entityLabel
    this.entities = entities.length > 0 ? entities : [this.newEntityTabData()]
  }
  private newEntityTabData() {
    return { id: '', label: `New ${this.entityLabel}`, active: true, tabType: "new-entity" } as TabEntity
  }
  setActive(i: number) {
    if (i === this.activeIdx) return
    let _activeIdx = this.activeIdx
    this.entities[i].active = true
    if (_activeIdx < 0) return
    this.entities[_activeIdx].active = false
  }
  pushNew() {
    this.entities[this.activeIdx].active = false;
    this.entities.push(this.newEntityTabData())
  }
  openTab(entity: Partial<TabEntity> & Pick<TabEntity, "id" | "label">) {
    this.entities[this.activeIdx].active = false
    let idxMaybe = this.findIdx(entity.id)
    if (idxMaybe >= 0) {
      this.entities[idxMaybe].active = true
    } else {
      this.entities.push({
        active: true,
        tabType: 'entity',
        ...entity,
      })
    }
  }
  findIdx(id: string) {
    return this.entities.findIndex(entity => entity.id === id)
  }
  remove({ entity }: { entity: TabEntity }) {
    let idx = this.entities.findIndex(({ id }) => id === entity.id)
    if (idx < 0) throw Error("Entity not found")
    this.entities.splice(idx, 1)
    if (idx === 0 && this.entities.length > 0) {
      this.entities[0].active = true
    } else if (this.entities.length > 0) {
      this.entities[idx - 1].active = true
    } else {
      this.entities.push(this.newEntityTabData())
    }
  }
}
