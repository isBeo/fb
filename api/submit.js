import { createClient } from '@supabase/supabase-js';
import { parse } from 'querystring';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', async () => {
      const { email, password } = parse(body);

      // Insert into Supabase table "users"
      const { error } = await supabase.from('users').insert([{ email, password }]);

      if (error) {
        console.error(error);
        return res.status(500).send('Database error');
      }

      // Redirect back to homepage
      res.writeHead(302, { Location: '/' });
      res.end();
    });
  } else {
    res.status(404).send('Not Found');
  }
}
