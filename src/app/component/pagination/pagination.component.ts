import { ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScoreService } from '../../services/score-service/score.service';
import { ScoreTableData } from '../../model/score.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements DoCheck {
  @Input() paginationData!: PaginationPayload;
  @Output() change: EventEmitter<number> = new EventEmitter();

  maxPage: number = 0;

  constructor() {}

  ngDoCheck(): void {
    this.maxPage = Math.ceil(this.paginationData.count_document / this.paginationData.amount)
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.maxPage) this.change.emit(page);
  }
}

export interface PaginationPayload {
  amount: number;
  page: number;
  count_document: number;
}
