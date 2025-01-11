import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScoreTableData } from '../../model/score.model';
import { NgIf } from '@angular/common';
import { ScoreService } from '../../services/score-service/score.service';

@Component({
  selector: 'app-add-score-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-score-dialog.component.html',
})
export class AddScoreDialogComponent implements OnInit {
  @Input() dataToBeEdited?: ScoreTableData;
  @Input() isEdit?: boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter(false);

  scoreForm!: FormGroup<ScoreFormModel | any>;

  constructor(private _formBuilder: FormBuilder, private _scoreService: ScoreService, private _cdr: ChangeDetectorRef) {
    this.scoreForm = this._formBuilder.group({
      _id: [''],
      name: ['', Validators?.required],
      course: ['', Validators?.required],
      score: ['', Validators?.required],
      class: ['', Validators?.required],
    });
  }

  ngOnInit(): void {
    this.scoreForm?.patchValue(
      this.dataToBeEdited ?? { _id: '', name: '', course: '', score: '', class: '' }
    );
    this._cdr.detectChanges();
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

    this.scoreForm.get('score')?.setValue(input.value);
  }

  addScore(): void {
    if (this.scoreForm?.valid) {
      this._scoreService?.addScore(this.scoreForm?.getRawValue() as ScoreTableData);
      this.closeDialog('add')
    }
  }

  editScore(): void {
    if (this.scoreForm?.valid && this.isEdit) {
      this._scoreService?.editScore(this.scoreForm?.getRawValue() as ScoreTableData);
      this.closeDialog('edit')
    }
  }

  closeDialog(from: string): void {
    from === 'close'
      ? this.close.emit(false)
      : this.close.emit(true);
  }
}

interface ScoreFormModel {
  _id?: FormControl<any>;
  name: FormControl<string | null>;
  course: FormControl<string | null>;
  score: FormControl<string | null>;
  class: FormControl<string | null>;
}
