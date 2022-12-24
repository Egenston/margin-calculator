import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  calculatedMargin: number = 0;
  potentialProfit: number = 0;
  potentialLoss: number = 0;
  
  form = new FormGroup({
    riskAmount: new FormControl('', [Validators.required, Validators.min(0)]),
    riskOption: new FormControl('%', [Validators.required, Validators.min(0)]),
    depositBalance: new FormControl('', [Validators.required, Validators.min(0)]),
    creditLeverage: new FormControl('', [Validators.required, Validators.min(0), Validators.max(125)]),
    entryPoint: new FormControl('', [Validators.required, Validators.min(0)]),
    stopLoss: new FormControl('', [Validators.required, Validators.min(0)]),
    takeProfit: new FormControl('', [Validators.required, Validators.min(0)])
  })

  checkRiskOption = () => {
    let riskAmountControls = this.form.controls['riskAmount'];
    this.calculatedMargin = 0;
    this.potentialLoss = 0;
    this.potentialProfit = 0;
    if (this.form.value.riskOption === "%") {
      riskAmountControls.addValidators(Validators.max(100));
      riskAmountControls.updateValueAndValidity();
      this.form.controls['depositBalance'].enable();
    }
    else {
      riskAmountControls.clearValidators();
      riskAmountControls.setValidators([Validators.required, Validators.min(0)])
      riskAmountControls.updateValueAndValidity();
      this.form.controls['depositBalance'].disable();
    }
  }

  displayMargin = () => {
    if (this.form.value.riskOption === "%") this.calculateRiskAmount();
    else this.calculateMargin(this.form.value.riskAmount);
  }

  calculateRiskAmount = () => {
    let depositBalance: number = this.form.value.depositBalance;
    let riskAmountInPercentages: number = this.form.value.riskAmount;
    let riskAmount = (depositBalance * riskAmountInPercentages) / 100;
    this.potentialLoss = riskAmount;
    this.calculateMargin(riskAmount);
  }

  calculateMargin = (riskAmount: number) => {
    let entryPoint: number = this.form.value.entryPoint;
    let stopLoss: number = this.form.value.stopLoss;
    let takeProfit: number = this.form.value.takeProfit;
    let leverage: number = this.form.value.creditLeverage;
    let stopPriceMovement: number = parseFloat(((Math.abs(entryPoint - stopLoss) * 100) / entryPoint).toFixed(2));
    let profitPriceMovement: number = parseFloat(((Math.abs(entryPoint - takeProfit) * 100) / entryPoint).toFixed(2));
    this.calculatedMargin = (riskAmount * 100) / (stopPriceMovement * leverage);
    this.potentialProfit = (this.calculatedMargin * profitPriceMovement * leverage) / 100;
  }

}
