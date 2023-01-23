const TicketTypeRequest = require('./lib/TicketTypeRequest.js');
const InvalidPurchaseException = require('./lib/InvalidPurchaseException.js');
const TicketPaymentService = require('../thirdparty/paymentgateway/TicketPaymentService.js');
const SeatReservationService = require('../thirdparty/seatbooking/SeatReservationService.js');
const TicketTypeResponse = require('./lib/TicketTypeResponse.js')

module.exports = class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ticketTypeRequests) {
    let isPaymentSuccussful = false;
    let isSeatReserved = false;
    let totalTickets = 0;
    let totalAmount = 0;
    let totalSeat = 0;
    let totalInfantTicket = 0;
    let totalChildTicket = 0;
    let totalAldultTicket = 0;
    try{

    
     // check that the accountId is valid
     if (!Number.isInteger(accountId)) 
         throw new Error('accountId must be an integer');
    
      // check that the ticketTypeRequests is an array
      if (!Array.isArray(ticketTypeRequests))
        throw new Error('ticketTypeRequests must be an array');
    
        for (let i = 0; i < ticketTypeRequests.length; i++) {
            if (!(ticketTypeRequests[i] instanceof TicketTypeRequest)) 
                throw new Error(`Element at index ${i} is not a valid TicketTypeRequest`);

          let ticket = ticketTypeRequests[i];
          if(ticket.getTicketType() == "ADULT")
              totalAldultTicket = totalAldultTicket + ticket.getNoOfTickets();
          else if(ticket.getTicketType() == "CHILD")
              totalChildTicket = totalChildTicket + ticket.getNoOfTickets();
          else if(ticket.getTicketType() == "INFANT")
              totalInfantTicket = totalInfantTicket + ticket.getNoOfTickets();
        }
       
        totalTickets = totalAldultTicket + totalChildTicket + totalInfantTicket;
        totalSeat = totalAldultTicket + totalChildTicket;
    
        if(totalTickets == 0)
            throw new TypeError('No tickets found');
    
        if(totalTickets > 20 )
            throw new TypeError('Maximum ticket that can be purchased at once is twenty');
        
        if(totalInfantTicket > 1 && totalAldultTicket == 0)
            throw new TypeError('Infants are not allowed without an adult');
    
        if(totalChildTicket > 1 && totalAldultTicket == 0)
            throw new TypeError('Children are not allowed without an adult');
        
        totalAmount = this.#CalculateTicketAmount(totalInfantTicket , totalChildTicket , totalAldultTicket);
        
        new TicketPaymentService().makePayment(accountId , totalAmount)
        isPaymentSuccussful = true
        
        new SeatReservationService().reserveSeat(accountId , totalSeat)
        isSeatReserved = true
        
        let response = new TicketTypeResponse(isSeatReserved , isPaymentSuccussful , totalAmount , totalSeat, "")
         
        return response;
      }
    catch(error){
        let errorResponse = new TicketTypeResponse(isSeatReserved , isPaymentSuccussful , totalAmount , totalSeat , error.message)
        return errorResponse;
    }
  }
  #CalculateTicketAmount(totalInfantTicket , totalChildTicket , totalAldultTicket){
    const infantTicketPrice = 0;
    const childrenTicketPrice = 10;
    const adultTicketPrice = 20;
    let totalAmount = 0;

    totalAmount = totalAmount + (infantTicketPrice * totalInfantTicket);
    totalAmount = totalAmount + (childrenTicketPrice * totalChildTicket);
    totalAmount = totalAmount + (adultTicketPrice * totalAldultTicket);

    return totalAmount;
 }
}
