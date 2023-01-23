/**
 * Immutable Object.
 */

 module.exports = class TicketTypeResponse {
    isSeatReserved;
    isPaymentSuccessful;
    totalAmount;
    totalSeatReserved;
    error;
    constructor(isSeatReserved, isPaymentSuccessful , totalAmount , totalSeatReserved ,error) {

      if (!Number.isInteger(totalAmount)) {
        throw new TypeError('totalAmount  must be an integer');
      }

      if (!Number.isInteger(totalSeatReserved)) {
        throw new TypeError('totalSeatReserved must be an integer');
      }

      if (typeof isSeatReserved !== "boolean") {
        throw new TypeError('isSeatReserved must be a boolean');
      }

      if (typeof isPaymentSuccessful !== "boolean") {
        throw new TypeError('isPaymentSuccessful must be a boolean');
      }
  
      this.isPaymentSuccessful = isPaymentSuccessful;
      this.isSeatReserved = isSeatReserved;
      this.totalAmount = totalAmount,
      this.totalSeatReserved = totalSeatReserved;
      this.error = error;
    }
  

  }
  