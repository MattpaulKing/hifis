export type TabEntity = { id: string, label: string, active: boolean }

export default class {
  entities = $state<TabEntity[]>([])
  activeIdx = $derived(this.entities.findIndex(entity => entity.active))
  activeAdd = $derived(this.activeIdx < 0)
  entityLabel: string;
  constructor({ entities, entityLabel }: { entities: TabEntity[], entityLabel: string }) {
    this.entityLabel = entityLabel
    this.entities = entities.length > 0 ? entities : [this.newEntity()]
  }
  private newEntity() {
    return { id: "", label: `New ${this.entityLabel}`, active: true }
  }
  setActive(i: number) {
    let _activeIdx = this.activeIdx
    this.entities[i].active = true
    if (_activeIdx < 0) return
    this.entities[_activeIdx].active = false
  }
  setAddActive() {
    this.entities[this.activeIdx].active = false;
    this.entities.push(this.newEntity())
  }
}
