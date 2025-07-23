import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export enum Action {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  CANCEL = 'CANCEL'
}

export enum Direction {
  BUY = 'BUY',
  SELL = 'SELL'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  equityForm: FormGroup;
  actions = Object.values(Action);
  directions = Object.values(Direction);
  positions: { securityCode: string; result: number }[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.equityForm = this.fb.group({
      securityCode: ['', Validators.required],
      quantity: [null, Validators.required],
      direction: [null, Validators.required],
      action: [Action.INSERT, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchPositions();
  }

  fetchPositions() {
    this.http.get<any[]>('http://localhost:8080/api/v1/equity/positions').subscribe({
      next: (data) => this.positions = data,
      error: (err) => console.error('Error fetching positions', err)
    });
  }

  onSubmit() {
    console.log('submit called')
    const formValue = this.equityForm.value;
    this.http.post('http://localhost:8080/api/v1/equity/save', formValue)
      .subscribe({
        next: (res) => {
          alert('Saved successfully!');
          this.equityForm.reset({ action: Action.INSERT });
          this.fetchPositions();
        },
        error: (err) => alert('Error saving: ' + err.message)
      });
  }

  selectEquity(equity: any) {
    this.equityForm.patchValue({
      securityCode: equity.securityCode,
      quantity: equity.quantity,
      direction: equity.direction,
      action: Action.UPDATE
    });
  }

  cancelEquity(equity: any) {
    this.equityForm.patchValue({
      securityCode: equity.securityCode,
      quantity: equity.quantity,
      direction: equity.direction,
      action: Action.CANCEL
    });
  }
}
