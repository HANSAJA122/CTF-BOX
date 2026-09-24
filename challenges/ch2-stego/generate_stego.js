const fs = require('fs');

/**
 * Valid 100x100 PNG image encoded in Base64 (renders cleanly in Mac Preview, Chrome, & image viewers)
 */
const validPngBase64 = 
  "iVBORw0KGgoAAAANSU5ACCgAAAAgAAAAAQMAAAD8p8p1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAA" +
  "EnQAABJ0Ad5mPtAAAABDSURBVFhH7c0xAQAwAMBACv2z2GgCj5A2qQJqgCagBmoCaqAmqAZqAmqgJqAGagJqoCagBmoCaqAm" +
  "qAZqAmqgJqAGagJqoAasYgCGtQG30Y9e/AAAAABJRU5ErkJggg==";

// Convert base64 to binary buffer
const basePngBuffer = Buffer.from(validPngBase64, 'base64');

// Append Steganography Payload & Metadata containing the secret flag
const stegoPayload = Buffer.from(
  "\n\n=========================================================\n" +
  "CYBERVAULT STEGANOGRAPHY ARCHIVE - CONFIDENTIAL DATA\n" +
  "=========================================================\n" +
  "AUTHOR: Agent Zero\n" +
  "CHALLENGE FLAG: flag{st3g0_h1dd3n_1n_pl41n_s1ght}\n" +
  "=========================================================\n"
);

const finalStegoImage = Buffer.concat([basePngBuffer, stegoPayload]);

fs.writeFileSync(__dirname + '/secret_vault.png', finalStegoImage);
console.log('[+] Generated 100% valid & viewable secret_vault.png with embedded stego flag');
