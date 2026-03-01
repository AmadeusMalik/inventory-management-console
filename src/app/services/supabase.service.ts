import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public supabase: any;

  constructor() {
    this.supabase = createClient(
      'https://mvkdfthmsulxavcjdgzu.supabase.co',
      'sb_publishable_D3AhHAEIwQFA130q6xwmxA_1dUCgZHf'
    );
  }

  

  async getInventory() {
    const { data, error } = await this.supabase.from('inventory').select('*');
    if (error) throw error;
    return data;
  }

  async addProduct(product: any) {
  return await this.supabase.from('inventory').insert([product]).select();
}

async updateProduct(id: string, updates: any) {
  return await this.supabase.from('inventory').update(updates).eq('id', id);
}

async deleteProduct(id: string) {
  return await this.supabase.from('inventory').delete().eq('id', id);
}
}
