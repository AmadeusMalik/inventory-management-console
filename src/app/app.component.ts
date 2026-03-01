import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
Chart.register(...registerables);
import { Component, input, OnInit } from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import { CommonModule } from '@angular/common'; // Important for *ngIf
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast'; // For Toasts
import { MessageService } from 'primeng/api'; // For showing messages after actions
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ChartModule,
    TagModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  displayDialog: boolean = false; // For the "Add Product" dialog
  newProduct: any = {
    product_name: '',
    sku: '',
    stock_level: 0,
    price: 0,
    sync_status: 'Success',
  }; // Model for the new product form
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  inventory: any[] = [];
  chartData: any;
  chartOptions: any;
  loading = true;

  constructor(
    private supabaseService: SupabaseService,
    private messageService: MessageService,
  ) {}

  async ngOnInit() {
    console.log('🚀 App Initialized. Calling Supabase...');
    try {
      this.inventory = await this.supabaseService.getInventory();
      console.log('📦 Data found:', this.inventory);
      // Set up chart options!!!
      if (this.inventory && this.inventory.length > 0) {
        this.initChart();
      }
    } catch (err) {
      console.error('❌ Error:', err);
    } finally {
      this.loading = false;
    }
  }
  // This method will be called once we have the inventory data to set up the chart
  initChart() {
    const labels = this.inventory.map((item) => item.product_name);
    const data = this.inventory.map((item) => item.stock_level);
    const backgroundColors = data.map((stock) =>
      stock < 5 ? '#ef4444' : '#3b82f6',
    );

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Inventory Level',
          data: data,
          backgroundColor: backgroundColors,
          borderRadius: 4,
        },
      ],
    };

    this.chartOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.5, // Optional: lower numbers make it stretch taller

      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { display: true },
        },
        y: {
          ticks: {
            autoSkip: false, // Don't hide any names
            font: { size: 11 }, // Shrink font slightly so names don't overlap
          },
        },
      },
      // This helps the chart resize properly when the window changes
      responsive: true,
    };
  }

  // --- DELETE ---
  async deleteItem(id: string) {
    // Simple confirm for safety
    const confirmed = confirm(
      'Are you sure you want to remove this product from inventory?',
    );

    if (confirmed) {
      const { error } = await this.supabaseService.deleteProduct(id);
      if (!error) {
        await this.refreshData();
        this.messageService.add({
          severity: 'warn',
          summary: 'Removed',
          detail: 'Item deleted successfully',
        });
      }
    }
  }
  // --- SYNC (Update) ---
  async syncItem(item: any) {
  // 1. Show a "Processing" toast
  this.messageService.add({severity:'info', summary:'Syncing', detail: `Fetching latest data for ${item.sku}...` });

  // 2. Update the status in Supabase (keeping the existing stock)
  const { error } = await this.supabaseService.updateProduct(item.id, 'Success',);

  if (!error) {
    await this.refreshData(); // Reload table and chart
    this.messageService.add({severity:'success', summary:'Synced', detail:'Inventory is up to date'});
  }
}
  // --- ADD ---
  showDialog() {
    this.displayDialog = true;
  }

 async addProduct() {
  // 1. Validation Check
  if (!this.newProduct.product_name || !this.newProduct.sku) {
    this.messageService.add({
      severity: 'error',
      summary: 'Validation Failed',
      detail: 'Product Name and SKU are required.'
    });
    return; // Stop the function here
  }

  if (this.newProduct.price <= 0 || this.newProduct.stock_level < 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Invalid Values',
      detail: 'Please enter a valid Price and Stock level.'
    });
    return;
  }

  // 3. Proceed to Database
  const { error } = await this.supabaseService.addProduct(this.newProduct);

  if (!error) {
    this.displayDialog = false;
    this.newProduct = {}; // Reset the form
    await this.refreshData(); // Update Table & Chart
    this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'Product added to inventory'});
  }
}

  async refreshData() {
    this.inventory = await this.supabaseService.getInventory();
    this.initChart(); // This recalculates the colors and bars
  }
}
