import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, DoCheck, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SelectionUtility } from '../../utilities/selection.util';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .container {
      @apply cursor-pointer;
    }

    .container input {
      display: none;
    }

    .container svg {
      overflow: visible;
    }

    .path {
      @apply stroke-[#28272C] dark:stroke-[#f6f6f6];
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
      stroke-dasharray: 241 9999999;
      stroke-dashoffset: 0;
    }

    .container input:checked ~ svg .path {
      stroke-dasharray: 70 9999999;
      stroke-dashoffset: -262.2723388671875;
    }
  `
})
export class TableComponent implements OnInit, DoCheck {
  @Input() TableConfiguration!: TableConfiguration;
  @Output() changeSelection: EventEmitter<number[]> = new EventEmitter();
  @Output() delete: EventEmitter<number> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  dataSource: any[] = [];
  dataCount: number = 0

  constructor(public selection: SelectionUtility<any>, private _cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dataSource = this.TableConfiguration?.tableData;
    this.dataCount = this.TableConfiguration?.tableData?.[0]?.count_documents;

    this.selection.initialize(
      (item) => item._id,
      true,
      []
    );
  }

  ngDoCheck(): void {
    this.dataSource = this.TableConfiguration?.tableData;

    this.selection?.getSelectedIds()?.forEach(selection => {
      if (!this.TableConfiguration?.fullTableData?.some(data => data._id === selection)) {
        this.selection?.deselect({_id: selection} as any);
      }
    })
    this._cdr.detectChanges();
  }

  isAllSelected() {
    return this.TableConfiguration?.fullTableData?.length === this.selection?.getSelectedIds()?.length && this.dataSource?.length;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.clear();
      this.selection?.selectAll(this.TableConfiguration?.fullTableData)
    }
  }

  selectionChange() {
    const selectionPayload = this.selection?.getSelectedIds();
    return this.changeSelection?.emit(selectionPayload);
  }

  editRow(row: any) {
    this.edit?.emit(row)
  }

  deleteRow(id: number | undefined) {
    if (typeof id === 'number') {
      this.delete?.emit(id);
    }
  }

  resolveColumnValue(column: any, rowData: any): any {
    const columnKey = column?.key || column?.dataToRetrieve?.toLowerCase();
    return rowData[columnKey] ?? '';
  }
}

export interface TableConfiguration {
  fixedTableColumns: {
    title: string;
    dataToRetrieve: string;
    isCheckbox: boolean;
    isHaveFilter: boolean;
    columnClass?: string;
    columnHeaderClass?: string[];
  }[];
  scrollTableColumns: {
    title: string;
    dataToRetrieve: string;
    isCheckbox: boolean;
    isHaveFilter: boolean;
    columnClass?: string;
    columnHeaderClass?: string[];
  }[];
  tableData: any[];
  fullTableData: any[];
}
