import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SubSink } from 'subsink';
import { ScoreTableData, ScoreTablePagination } from '../../model/score.model';
import { ScoreService } from '../../services/score-service/score.service';
import { TableComponent, TableConfiguration } from '../table/table.component';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { AddScoreDialogComponent } from "../add-score-dialog/add-score-dialog.component";
import { NgClass, NgIf } from '@angular/common';
import { PaginationComponent, PaginationPayload } from "../pagination/pagination.component";

@Component({
  selector: 'app-score-table',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule, AddScoreDialogComponent, NgIf, PaginationComponent, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './score-table.component.html',
})
export class ScoreTableComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  tableConfig: TableConfiguration = {
    fixedTableColumns: [
      {
        title: 'checkbox',
        dataToRetrieve: 'name',
        isCheckbox: true,
        isHaveFilter: false,
      },
    ],
    scrollTableColumns: [
      {
        title: 'Nomor siswa',
        dataToRetrieve: 'student_id',
        isCheckbox: false,
        isHaveFilter: false,
        columnClass: 'w-48'
      },
      {
        title: 'Nama',
        dataToRetrieve: 'name',
        isCheckbox: false,
        isHaveFilter: false,
        columnClass: 'w-72',
      },
      {
        title: 'Pelajaran',
        dataToRetrieve: 'course',
        isCheckbox: false,
        isHaveFilter: false,
        columnClass: 'w-48',
      },
      {
        title: 'Nilai',
        dataToRetrieve: 'score',
        isCheckbox: false,
        isHaveFilter: false,
        columnClass: 'w-48',
      },
      {
        title: 'Kelas',
        dataToRetrieve: 'class',
        isCheckbox: false,
        isHaveFilter: false,
        columnClass: 'w-48',
      },
    ],
    tableData: [],
    fullTableData: [],
  };

  paginationConfig!: PaginationPayload;

  superFilter: FormGroup<SuperFilterModel>;
  pagination: ScoreTablePagination = {
    amount: 5,
    page: 1,
  };

  currentSelection: number[] = [];
  isOpenDialog: boolean = false;
  isEdit: boolean = false;
  dataToBeEdited: ScoreTableData | undefined;

  constructor(
    private _scoreService: ScoreService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef
  ) {
    this.superFilter = this._formBuilder.group({
      name: [''],
      course: [''],
      score: [''],
    });
  }

  ngOnInit(): void {
    const currentPagination =
      localStorage.getItem('score-table-pagination') ?? '';
    const currentFilter = localStorage.getItem('score-table-filter') ?? '';

    if (currentPagination) this.pagination = JSON.parse(currentPagination);
    if (currentFilter) this.superFilter?.setValue(JSON.parse(currentFilter));

    this.fetchScoreData();
  }

  fetchScoreData() {
    const payload = { ...this.superFilter?.getRawValue() };
    this._subs.sink = this._scoreService
      ?.fetchScoreData(payload as ScoreTableData, this.pagination)
      ?.subscribe({
        next: (resp) => {
          this.tableConfig.tableData = _.cloneDeep(resp);
          this.tableConfig.fullTableData =
            this._scoreService?.getFullTableData();
            this.paginationConfig = {
              ...this.pagination,
              count_document: this.tableConfig.tableData?.[0]?.count_documents
            }
        },
      });
  }

  deleteScore(id: number | number[]) {
    let operation: Observable<void>;

    if (typeof id === 'number') {
      operation = of(this._scoreService.removeTableDataById(id));
    } else {
      operation = of(this._scoreService.removeTableDataByIds(id));
    }

    operation.subscribe(() => {
      this.fetchScoreData();
      this._cdr.detectChanges();
    });
  }

  resetFilter(): void {
    this.superFilter?.setValue({
      name: '',
      course: '',
      score: null,
    });

    this.fetchScoreData();
  }

  restrictInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!/^\d*$/.test(value)) {
      input.value = value.replace(/[^\d]/g, '');
    }

    if (/^0[1-9]+/.test(value)) {
      input.value = value.replace(/^0+/, '');
    }

    const numericValue = Number(input.value);
    if (numericValue > 100) {
      input.value = '100';
    }

    this.superFilter.get('score')?.setValue(input.value);
  }

  openAddScoreDialog(action: string): void {
    this.isOpenDialog = true;
    if (action === 'add') {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }
  }

  closeAddScoreDialog(event: boolean): void {
    this.isOpenDialog = false;
    this.dataToBeEdited = undefined;

    if (event) this.fetchScoreData()
  }

  ngOnDestroy(): void {
    this._subs?.unsubscribe();
  }
}

interface SuperFilterModel {
  name: FormControl<string | null>;
  course: FormControl<string | null>;
  score: FormControl<string | null>;
}
