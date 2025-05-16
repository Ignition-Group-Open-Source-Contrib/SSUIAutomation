import { randomInt } from 'crypto';

    function generateRandomID() {
        // Generate a random 2-digit birth year offset (00-99)
        let birthYearOffset = randomInt(0, 100); // Random number between 0 and 99
        let yearString = birthYearOffset.toString().padStart(2, '0');

        // Generate a random 2-digit birth month (01-12)
        let birthMonth = randomInt(1, 13); // Random number between 1 and 12
        let monthString = birthMonth.toString().padStart(2, '0');

        // Generate a random 2-digit birth day (01-31)
        let maxDay = new Date(1900 + birthYearOffset, birthMonth, 0).getDate(); // Max days in the month
        if (isNaN(maxDay) || maxDay <= 0) {
            throw new Error("Invalid day value generated.");
        }
        let birthDay = randomInt(1, maxDay + 1); // Random day between 1 and maxDay
        let dayString = birthDay.toString().padStart(2, '0');

        // Generate a random 6-digit unique identifier
        let uniqueIdentifier = randomInt(0, 1000000); // Random number between 0 and 999999

        // Concatenate the components
        let randomID = `${yearString}${monthString}${dayString}${uniqueIdentifier.toString().padStart(6, '0')}`;

        // Apply the Luhn algorithm to calculate the control digit
        let sum = 0;
        let alternate = false;

        for (let i = 0; i < randomID.length; i++) {
            let digit = parseInt(randomID[i]);

            if (alternate) {
                digit *= 2;

                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            alternate = !alternate;
        }

        let controlDigit = (10 - (sum % 10)) % 10;
        randomID += controlDigit.toString();

        // console.log(`birthYearOffset: ${birthYearOffset}, birthMonth: ${birthMonth}, maxDay: ${maxDay}`);

        return randomID;
    }


export { generateRandomID }; // ES Module export
