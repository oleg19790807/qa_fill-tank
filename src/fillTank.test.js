/* eslint-disable max-len */
'use strict';

const { fillTank } = require('./fillTank');

describe('fillTank', () => {
  let customer;

  // Reset customer before each test
  beforeEach(() => {
    customer = {
      money: 3000,
      vehicle: {
        maxTankCapacity: 40,
        fuelRemains: 8,
      },
    };
  });

  it('should fill tank to full capacity when no amount specified', () => {
    const fuelPrice = 1.50;

    fillTank(customer, fuelPrice);
    expect(customer.vehicle.fuelRemains).toBe(40); // 8 + 32 = 40
    expect(customer.money).toBe(3000 - 32 * 1.50); // 3000 - 48 = 2952
    expect(customer.money).toBe(2952);
  });

  it('should fill requested amount when less than free space', () => {
    const fuelPrice = 2.00;

    fillTank(customer, fuelPrice, 10);
    expect(customer.vehicle.fuelRemains).toBe(18); // 8 + 10 = 18
    expect(customer.money).toBe(2980); // 3000 - (10 * 2) = 2980
  });

  it('should fill only available space when amount exceeds capacity', () => {
    const fuelPrice = 1.75;

    fillTank(customer, fuelPrice, 50);
    expect(customer.vehicle.fuelRemains).toBe(40); // 8 + 32 = 40
    expect(customer.money).toBe(2944); // 3000 - (32 * 1.75) = 2944
  });

  it('should fill only what customer can afford', () => {
    customer.money = 20;

    const fuelPrice = 2.50;

    fillTank(customer, fuelPrice);
    expect(customer.vehicle.fuelRemains).toBe(16); // 8 + 8 = 16 (20/2.5 = 8)
    expect(customer.money).toBe(0); // 20 - (8 * 2.5) = 0
  });

  it('should not fill if amount less than 2 liters', () => {
    const fuelPrice = 2.00;

    fillTank(customer, fuelPrice, 1.5);
    expect(customer.vehicle.fuelRemains).toBe(8); // unchanged
    expect(customer.money).toBe(3000); // unchanged
  });

  it('should round fuel amount to one decimal place', () => {
    const fuelPrice = 1.33;

    fillTank(customer, fuelPrice, 10.77);
    expect(customer.vehicle.fuelRemains).toBe(18.7); // 8 + 10.7 = 18.7
    expect(customer.money).toBeCloseTo(2985.77, 2); // 3000 - (10.7 * 1.33) = 2985.769 rounded to 2985.77
  });

  it('should round price to two decimal places', () => {
    const fuelPrice = 1.555;

    fillTank(customer, fuelPrice, 5);
    expect(customer.vehicle.fuelRemains).toBe(13); // 8 + 5 = 13
    expect(customer.money).toBe(3000 - 7.78); // 5 * 1.555 = 7.775 ≈ 7.78
    expect(customer.money).toBe(2992.22);
  });

  it('should handle edge case with very low funds', () => {
    customer.money = 3;

    const fuelPrice = 2.00;

    fillTank(customer, fuelPrice);
    expect(customer.vehicle.fuelRemains).toBe(8); // unchanged (1.5 < 2 minimum)
    expect(customer.money).toBe(3); // unchanged
  });

  it('should handle zero amount request', () => {
    const fuelPrice = 1.50;

    fillTank(customer, fuelPrice, 0);
    expect(customer.vehicle.fuelRemains).toBe(8); // unchanged
    expect(customer.money).toBe(3000); // unchanged
  });
});
