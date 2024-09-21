import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Train Seat Reservation';
  seatLayout: any[][] = [];
  totalSeats = 80;
  seatsPerRow = 7;
  lastRowSeats = 3;
  bookingResult: number[] = [];
  bookingError: string = '';

  constructor() {
    this.initializeSeats();
  }

  // Initialize the seat layout
  initializeSeats() {
    let seatNumber = 1;

    // Create rows of 7 seats
    for (let i = 0; i < Math.floor(this.totalSeats / this.seatsPerRow); i++) {
      const row = [];
      for (let j = 0; j < this.seatsPerRow; j++) {
        row.push({ seatNumber: seatNumber++, available: true });
      }
      this.seatLayout.push(row);
    }

    // Create last row with 3 seats
    const lastRow = [];
    for (let j = 0; j < this.lastRowSeats; j++) {
      lastRow.push({ seatNumber: seatNumber++, available: true });
    }
    this.seatLayout.push(lastRow);
  }

  // Function to book seats
  bookSeats(numSeats: number) {
    this.bookingResult = [];
    this.bookingError = '';

    if (numSeats < 1 || numSeats > 7) {
      this.bookingError = 'You can book between 1 and 7 seats at a time.';
      return;
    }

    // Try to book seats in one row
    for (let row of this.seatLayout) {
      let availableSeats = row.filter((seat) => seat.available);

      if (availableSeats.length >= numSeats) {
        availableSeats.slice(0, numSeats).forEach((seat) => {
          seat.available = false;
          this.bookingResult.push(seat.seatNumber);
        });
        return;
      }
    }

    // If not available in one row, book nearby seats
    let bookedSeats: number[] = [];
    for (let row of this.seatLayout) {
      let availableSeats = row.filter((seat) => seat.available);
      availableSeats.forEach((seat) => {
        if (bookedSeats.length < numSeats) {
          seat.available = false;
          bookedSeats.push(seat.seatNumber);
        }
      });
      if (bookedSeats.length === numSeats) break;
    }

    if (bookedSeats.length === numSeats) {
      this.bookingResult = bookedSeats;
    } else {
      this.bookingError = 'Not enough seats available.';
    }
  }
}
