import { addDays, parseDay, today, toDay } from "./dates";
import type { Activity, CrmState, Customer, Opportunity } from "./types";

/**
 * FICTIONAL SAMPLE DATA. None of these people, companies, numbers or values
 * are real Mayfair customers or results. Dates are relative to the day the
 * demo is opened, so the story always reads correctly: some follow-ups are due
 * today, some are overdue, one is parked until January.
 */
export function createSampleState(ref = today()): CrmState {
  const day = (offset: number) => addDays(ref, offset);
  const at = (offset: number, hh = 9, mm = 0) => {
    const d = parseDay(day(offset));
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  };

  // Next 15 January that is still ahead.
  const r = parseDay(ref);
  const january = toDay(new Date(r.getMonth() === 0 && r.getDate() < 15 ? r.getFullYear() : r.getFullYear() + 1, 0, 15));

  const customers: Customer[] = [];
  const opportunities: Opportunity[] = [];
  const activities: Activity[] = [];
  let a = 0;

  const customer = (c: Omit<Customer, "createdAt" | "sample">, created: number) => {
    customers.push({ ...c, createdAt: at(created, 8), sample: true });
    return c.id;
  };
  const opp = (o: Omit<Opportunity, "sample">, log: [number, number, Activity["type"], string][]) => {
    opportunities.push({ ...o, sample: true });
    for (const [offset, hour, type, text] of log) {
      activities.push({ id: `sa${++a}`, opportunityId: o.id, at: at(offset, hour, (a * 7) % 60), type, text });
    }
  };

  // — A repeat customer: painting won earlier, electrical enquiry today.
  const kabelo = customer({ id: "c1", name: "Kabelo Molefe", phone: "+267 71 000 101", email: "kabelo.molefe@example.com", type: "homeowner" }, -46);
  opp(
    { id: "o1", customerId: kabelo, service: "painting", title: "Exterior repaint, 4-bedroom house", location: "Phakalane", source: "google_business", stage: "won", value: 38500, receivedAt: at(-46, 10, 12), lastContactAt: at(-33), closedAt: at(-33, 15), assignedTo: "Owner" },
    [
      [-46, 10, "received", "Enquiry received via Google Business Profile"],
      [-46, 11, "call", "Called Kabelo. Wants the exterior repainted before the rains."],
      [-44, 9, "visit", "Site visit: walls measured, cracks noted on the north side"],
      [-41, 14, "quote", "Quote sent: P 38,500"],
      [-36, 12, "call", "Kabelo asked for colour samples"],
      [-33, 15, "won", "Won. Work booked to start in two weeks."],
    ],
  );
  opp(
    { id: "o2", customerId: kabelo, service: "electrical", title: "Driveway lighting and two outdoor sockets", location: "Phakalane", source: "repeat", stage: "new", value: 9500, receivedAt: at(0, 8, 40), nextFollowUp: day(0), nextAction: "Call customer", assignedTo: "Office", notes: "Happy with the painting job. Wants lights along the driveway." },
    [[0, 8, "received", "WhatsApp message from a repeat customer"]],
  );

  const naledi = customer({ id: "c2", name: "Naledi Kgosi", company: "Seboni Property Management", phone: "+267 72 000 102", email: "naledi@example.com", type: "property_manager" }, -15);
  opp(
    { id: "o3", customerId: naledi, service: "office_partitioning", title: "Second floor into six offices and a meeting room", location: "Main Mall, Gaborone", source: "website", stage: "quote_sent", value: 126000, receivedAt: at(-15, 9, 20), lastContactAt: at(-7, 16), nextFollowUp: day(0), nextAction: "Follow up on quote", assignedTo: "Owner", notes: "New tenant moves in next quarter. Naledi needs board sign-off on the quote." },
    [
      [-15, 9, "received", "Enquiry received via the website form"],
      [-14, 10, "call", "Called Naledi. New tenant moving in next quarter."],
      [-12, 9, "visit", "Site visit: floor measured, power points marked"],
      [-7, 16, "quote", "Quote sent: P 126,000"],
      [-7, 16, "followup", "Follow-up set: Follow up on quote, in 7 days"],
    ],
  );

  const thabo = customer({ id: "c3", name: "Thabo Kgathi", company: "Kgale Ridge Developments", phone: "+267 73 000 103", type: "developer" }, -6);
  opp(
    { id: "o4", customerId: thabo, service: "electrical", title: "Electrical installation for six townhouses", location: "Block 10, Gaborone", source: "referral", stage: "site_visit", value: 210000, receivedAt: at(-6, 11), lastContactAt: at(-5, 10), nextFollowUp: day(1), nextAction: "Site visit", assignedTo: "Site team", notes: "Referred by a previous client. Wants a quote before the end of the month." },
    [
      [-6, 11, "received", "Enquiry received through a referral"],
      [-5, 10, "call", "Called Thabo. Site visit booked for 09:00."],
      [-5, 10, "stage", "Moved to Site visit"],
    ],
  );

  const mpho = customer({ id: "c4", name: "Mpho Dintwa", company: "Letsatsi Logistics", phone: "+267 74 000 104", type: "company" }, -5);
  opp(
    { id: "o5", customerId: mpho, service: "forklift_hire", title: "2.5 t forklift for two weeks", location: "Gaborone West", source: "phone", stage: "contacted", value: 18000, receivedAt: at(-5, 14), lastContactAt: at(-4, 9), nextFollowUp: day(-2), nextAction: "Confirm hire dates", assignedTo: "Office" },
    [
      [-5, 14, "received", "Phone enquiry"],
      [-4, 9, "call", "Mpho needs the forklift from the 1st. He will confirm the dates."],
    ],
  );

  const gaone = customer({ id: "c5", name: "Gaone Tau", company: "Tau Building Works", phone: "+267 75 000 105", type: "company" }, -1);
  opp(
    { id: "o6", customerId: gaone, service: "concrete_mixer_hire", title: "Mixer for a slab pour, 3 days", location: "Tlokweng", source: "whatsapp", stage: "new", value: 2400, receivedAt: at(-1, 14, 10), nextFollowUp: day(-1), nextAction: "Call customer", assignedTo: "Office" },
    [[-1, 14, "received", "WhatsApp enquiry: needs a mixer this weekend"]],
  );

  const onalenna = customer({ id: "c6", name: "Onalenna Pule", company: "Mosu Savings Co-operative", phone: "+267 76 000 106", email: "facilities@example.com", type: "bank" }, -20);
  opp(
    { id: "o7", customerId: onalenna, service: "atm_installation", title: "Two through-the-wall ATMs at new branches", location: "Francistown and Palapye", source: "referral", stage: "quote_preparing", value: 340000, receivedAt: at(-20, 9), lastContactAt: at(-3, 11), nextFollowUp: day(2), nextAction: "Send quote", assignedTo: "Owner" },
    [
      [-20, 9, "received", "Enquiry received through a referral"],
      [-19, 10, "call", "Call with Onalenna. Two branches, opening next quarter."],
      [-10, 8, "visit", "Site visits at both branches"],
      [-9, 15, "stage", "Moved to Quote preparing"],
      [-3, 11, "note", "Waiting for the ATM supplier's installation specification"],
    ],
  );

  const boitumelo = customer({ id: "c7", name: "Boitumelo Ntsima", company: "Tlotlo Office Park", phone: "+267 77 000 107", type: "company" }, -24);
  opp(
    { id: "o8", customerId: boitumelo, service: "ev_charging", title: "Four EV charging bays in staff parking", location: "Fairgrounds, Gaborone", source: "website", stage: "quote_sent", value: 165000, receivedAt: at(-24, 13), lastContactAt: at(-16, 15), nextFollowUp: day(-4), nextAction: "Check decision", assignedTo: "Owner" },
    [
      [-24, 13, "received", "Enquiry received via the website form"],
      [-23, 9, "call", "Called Boitumelo. Wants chargers for four staff bays."],
      [-20, 10, "visit", "Site visit: supply capacity and cable route checked"],
      [-16, 15, "quote", "Quote sent: P 165,000"],
      [-16, 15, "followup", "Follow-up set: Check decision, in 12 days"],
    ],
  );

  const lesego = customer({ id: "c8", name: "Lesego Modise", phone: "+267 71 000 108", type: "homeowner" }, -40);
  opp(
    { id: "o9", customerId: lesego, service: "restoration", title: "Family house: roof leaks and cracked walls", location: "Mogoditshane", source: "facebook", stage: "on_hold", value: 95000, receivedAt: at(-40, 18), lastContactAt: at(-30, 12), nextFollowUp: january, nextAction: "Contact again: funding decision", assignedTo: "Owner", notes: "Lesego asked us to contact her in January, once her funding is approved." },
    [
      [-40, 18, "received", "Facebook message"],
      [-35, 9, "visit", "Site visit: roof and walls assessed"],
      [-31, 14, "quote", "Quote sent: P 95,000"],
      [-30, 12, "stage", "On hold: waiting for funding. Contact in January."],
    ],
  );

  const tumelo = customer({ id: "c9", name: "Tumelo Baitshepi", phone: "+267 72 000 109", type: "homeowner" }, -35);
  opp(
    { id: "o10", customerId: tumelo, service: "carpeting", title: "Carpet for three bedrooms", location: "Gaborone North", source: "google_business", stage: "on_hold", value: 14500, receivedAt: at(-35, 10), lastContactAt: at(-30, 10), nextFollowUp: day(0), nextAction: "Contact again: after month-end", assignedTo: "Office" },
    [
      [-35, 10, "received", "Enquiry received via Google Business Profile"],
      [-34, 11, "call", "Called Tumelo. Measurements sent by WhatsApp."],
      [-32, 15, "quote", "Quote sent: P 14,500"],
      [-30, 10, "stage", "On hold: asked us to call back after month-end"],
    ],
  );

  const kagiso = customer({ id: "c10", name: "Kagiso Seboko", company: "Thamaga Agri Supplies", phone: "+267 73 000 110", type: "company" }, -12);
  opp(
    { id: "o11", customerId: kagiso, service: "pallet_jack_hire", title: "Two pallet jacks for one week", location: "Gaborone", source: "phone", stage: "won", value: 3200, receivedAt: at(-12, 9), lastContactAt: at(-10), closedAt: at(-10, 11), assignedTo: "Office" },
    [
      [-12, 9, "received", "Phone enquiry"],
      [-11, 10, "quote", "Hire price sent: P 3,200"],
      [-10, 11, "won", "Won. Collected on Monday."],
    ],
  );

  const keabetswe = customer({ id: "c11", name: "Keabetswe Molefi", company: "Notwane Residences", phone: "+267 74 000 111", type: "property_manager" }, -38);
  opp(
    { id: "o12", customerId: keabetswe, service: "painting", title: "Repaint stairwells and corridors", location: "Broadhurst", source: "website", stage: "lost", value: 72000, receivedAt: at(-38, 12), lastContactAt: at(-20), closedAt: at(-20, 10), lostReason: "Price", assignedTo: "Owner" },
    [
      [-38, 12, "received", "Enquiry received via the website form"],
      [-36, 9, "visit", "Site visit: four stairwells, three floors"],
      [-30, 16, "quote", "Quote sent: P 72,000"],
      [-20, 10, "lost", "Lost: went with a lower quote"],
    ],
  );

  const neo = customer({ id: "c12", name: "Neo Ramasu", company: "Ditshupo Homes", phone: "+267 75 000 112", type: "developer" }, -3);
  opp(
    { id: "o13", customerId: neo, service: "plate_compactor_hire", title: "Plate compactor for paving, one week", location: "Mmopane", source: "google_ads", stage: "contacted", value: 4800, receivedAt: at(-3, 8, 30), lastContactAt: at(-3, 10), assignedTo: "Office" },
    [
      [-3, 8, "received", "Enquiry received from a Google Ads call"],
      [-3, 10, "call", "Called Neo. Paving starts once the base is ready."],
    ],
  );

  const dineo = customer({ id: "c13", name: "Dineo Kebonang", company: "Ngami Freight", phone: "+267 76 000 113", type: "company" }, -50);
  opp(
    { id: "o14", customerId: dineo, service: "office_partitioning", title: "Reception and two offices", location: "Maun", source: "referral", stage: "lost", value: 58000, receivedAt: at(-50, 11), lastContactAt: at(-27), closedAt: at(-27, 14), lostReason: "Project cancelled", assignedTo: "Owner" },
    [
      [-50, 11, "received", "Enquiry received through a referral"],
      [-45, 9, "visit", "Site visit in Maun"],
      [-40, 15, "quote", "Quote sent: P 58,000"],
      [-27, 14, "lost", "Lost: the office move was cancelled"],
    ],
  );

  const oratile = customer({ id: "c14", name: "Oratile Seane", phone: "+267 77 000 114", type: "homeowner" }, -6);
  opp(
    { id: "o15", customerId: oratile, service: "electrical", title: "Fault finding: tripping kitchen circuit", location: "Tlokweng", source: "whatsapp", stage: "won", value: 6800, receivedAt: at(-6, 19), lastContactAt: at(-3), closedAt: at(-3, 16), assignedTo: "Site team" },
    [
      [-6, 19, "received", "WhatsApp enquiry with photos of the board"],
      [-5, 9, "visit", "Fault traced to the stove circuit"],
      [-3, 16, "won", "Won. Repair completed."],
    ],
  );

  const refilwe = customer({ id: "c15", name: "Refilwe Gabaake", phone: "+267 71 000 115", email: "refilwe@example.com", type: "homeowner" }, 0);
  opp(
    { id: "o16", customerId: refilwe, service: "ev_charging", title: "Home EV charger", location: "Phakalane", source: "website", stage: "new", receivedAt: at(0, 7, 15), nextFollowUp: day(0), nextAction: "Contact customer", notes: "Bought an electric car. Wants a charger in the garage." },
    [[0, 7, "received", "Enquiry received via the website form"]],
  );

  return { version: 1, seededOn: ref, customers, opportunities, activities };
}
