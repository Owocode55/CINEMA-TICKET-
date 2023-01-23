const TicketService = require('../src/pairtest/TicketService');
const TicketTypeRequest = require('../src/pairtest/lib/TicketTypeRequest');

describe('purchaseTickets', () => {
  let ticketService;
   beforeEach(() => {
     ticketService = new TicketService();
   });
 
     it('should throw an error if accountId is not an integer', () => {
         const accountId = "notaninteger";
         const ticketTypeRequests = [new TicketTypeRequest("ADULT", 2)];
         const response = ticketService.purchaseTickets(accountId, ticketTypeRequests);
         expect(response.error).toEqual('accountId must be an integer');
     });
 
     it('should throw an error if ticketTypeRequests is not an array', () => {
         const accountId = 123;
         const ticketTypeRequests = { type: "notanarray" };
         const response = ticketService.purchaseTickets(accountId, ticketTypeRequests);
         expect(response.error).toEqual('ticketTypeRequests must be an array');
     });
 
     it('should throw an error if ticketTypeRequests array contains an invalid object', () => {
         const accountId = 123;
         const ticketTypeRequests = [{ type: "notaticketrequest" }];
         const response = ticketService.purchaseTickets(accountId, ticketTypeRequests);
         expect(response.error).toEqual('Element at index 0 is not a valid TicketTypeRequest');
     });
 
     it('should throw an error if total number of tickets is more than 20', () => {
         const accountId = 123;
         const ticketTypeRequests = [new TicketTypeRequest("ADULT", 10),new TicketTypeRequest("CHILD", 10),new TicketTypeRequest("INFANT", 1)];
         const response = ticketService.purchaseTickets(accountId, ticketTypeRequests);
         expect(response.error).toEqual('Maximum ticket that can be purchased at once is twenty');
     });
 
     it('should throw an error if there are infants without an adult', () => {
         const accountId = 123;
         const ticketTypeRequests = [new TicketTypeRequest("INFANT", 2)];
         const response = ticketService.purchaseTickets(accountId, ticketTypeRequests);
         expect(response.error).toEqual('Infants are not allowed without an adult');
     });
 
     it('should throw an error if there are children without an adult', () => {
         const accountId = 123;
         const ticketTypeRequests = [new TicketTypeRequest("CHILD", 2)];
         const response = ticketService.purchaseTickets(accountId, ticketTypeRequests);
         expect(response.error).toEqual('Children are not allowed without an adult');
     });
 
     it('should return a successful response if all inputs are valid', () => {
         const accountId = 123;
         const ticketTypeRequests = [new TicketTypeRequest("ADULT", 2),new TicketTypeRequest("CHILD", 1)];
         const response = ticketService.purchaseTickets(accountId, ticketTypeRequests);
         expect(response.isPaymentSuccessful).toBe(true);
         expect(response.isSeatReserved).toBe(true);
         expect(response.totalAmount).toBe(50);
         expect(response.totalSeatReserved).toBe(3);
         expect(response.error).toBe("")
       });

      })
