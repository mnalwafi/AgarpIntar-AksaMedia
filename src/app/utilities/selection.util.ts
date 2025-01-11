import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root', // or 'any' for global scope
})
export class SelectionUtility<T> {
  private selectedIds: Set<any> = new Set();
  private getId!: (item: T) => any;
  private allowMultiSelect: boolean = true;

  constructor() {}

  initialize(
    getId: (item: T) => any,
    allowMultiSelect: boolean = true,
    initialSelection: T[] = []
  ): void {
    this.getId = getId;
    this.allowMultiSelect = allowMultiSelect;
    this.selectedIds = new Set(initialSelection.map(this.getId));
  }

  getLength(): number {
    return this.selectedIds.size;
  }

  hasValue(): boolean {
    return this.selectedIds.size > 0;
  }

  select(item: T): void {
    const id = this.getId(item);
    if (!this.allowMultiSelect) {
      this.clear();
    }
    this.selectedIds.add(id);
  }

  deselect(item: T): void {
    const id = this.getId(item);
    this.selectedIds.delete(id);
  }

  toggle(item: T): void {
    const id = this.getId(item);
    if (this.selectedIds.has(id)) {
      this.deselect(item);
    } else {
      this.select(item);
    }
  }

  isSelected(item: T): boolean {
    const id = this.getId(item);
    return this.selectedIds.has(id);
  }

  clear(): void {
    this.selectedIds.clear();
  }

  getSelected(items: T[]): T[] {
    return items.filter((item) => this.selectedIds.has(this.getId(item)));
  }

  getSelectedIds(): any[] {
    return Array.from(this.selectedIds).filter((item) => typeof item === 'number');
  }

  isAllSelected(items: T[]): boolean {
    return items.every((item) => this.selectedIds.has(this.getId(item)));
  }

  selectAll(items: T[]): void {
    if (this.allowMultiSelect) {
      items.forEach((item) => this.selectedIds.add(this.getId(item)));
    }
  }

  deselectAll(items: T[]): void {
    items.forEach((item) => this.selectedIds.delete(this.getId(item)));
  }
}
