// Replace the process.env lines with your actual strings from Supabase
const supabaseUrl = 'https://your-project-url.supabase.co'; 
const supabaseKey = 'your-anon-key-here';
const supabase = createClient(supabaseUrl, supabaseKey);
const cors = require('cors');
app.use(cors()); // This must be ABOVE your app.get routes
// Add this line to test the connection immediately on startup
supabase.from('pharmacies').select('name').limit(1)
  .then(() => console.log("✅ Successfully connected to Supabase Database"))
  .catch(err => console.log("❌ Database Connection Error:", err.message));

