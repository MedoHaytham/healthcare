// utils/slotGenerator.js

/**
 * Converts "HH:mm" to minutes since midnight
 */
const toMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Converts minutes since midnight back to "HH:mm"
 */
const toTimeString = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Generates all possible slots for a day given doctor availability
 * @returns {string[]} e.g. ["09:00-09:30", "09:30-10:00", ...]
 */
exports.generateDaySlots = ({ startTime, endTime, slotDuration }) => {
  const slots = [];
  let cursor = toMinutes(startTime);
  const end = toMinutes(endTime);

  while (cursor + slotDuration <= end) {
    const slotStart = toTimeString(cursor);
    const slotEnd = toTimeString(cursor + slotDuration);
    slots.push(`${slotStart}-${slotEnd}`);
    cursor += slotDuration;
  }

  return slots;
};

exports.getDayName = (date) =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'long' });