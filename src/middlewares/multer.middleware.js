import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });






/*
WHY MULTER IS USED:

Express can only parse:
1) application/json               → JSON APIs (text only)
2) application/x-www-form-urlencoded → Traditional HTML forms (text only)

Express CANNOT parse:
3) multipart/form-data → Used when forms send FILES + text together.

multipart/form-data splits the request into multiple "parts":
- one part per text field
- one part per file (binary data)

Because files are binary and boundary-based, Express does not handle this format by default.

Multer is middleware that:
✔ parses multipart/form-data
✔ extracts uploaded files
✔ stores them (disk or memory)
✔ attaches files to request object

After Multer runs:
req.body   → contains text fields
req.file   → contains single uploaded file
req.files  → contains multiple uploaded files

Different form data types:

application/json
→ Used in APIs
→ Example: { "email": "test@gmail.com" }

application/x-www-form-urlencoded
→ Traditional HTML forms (text only)
→ Example: email=test@gmail.com&password=123

multipart/form-data
→ Required when uploading files
→ Example: avatar + username + email
→ Needs Multer to process

Flow with file upload:

Frontend sends multipart/form-data
↓
Multer parses request
↓
Files become req.file / req.files
↓
Text fields remain in req.body
↓
Controller can access both

Without Multer, uploaded files are NOT accessible in Express.
*/
