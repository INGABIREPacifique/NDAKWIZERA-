import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase Key exists:', !!supabaseKey)
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing environment variables',
        url: supabaseUrl,
        hasKey: !!supabaseKey
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Try to query the cases table
    const { data, error, count } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error.details,
        hint: error.hint,
        url: supabaseUrl
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '✅ Supabase connected!',
      url: supabaseUrl,
      tableExists: true,
      caseCount: count || 0
    })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    })
  }
}