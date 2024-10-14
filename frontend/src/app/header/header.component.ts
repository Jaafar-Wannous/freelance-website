import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  guest =  false;
  seller = false;
  buyer = true;

  // isSearchVisible: boolean = false;
  searchTerm: string = '';
  items: any[] = [
    { name: 'Item 1' },
    { name: 'Item 2' },
    { name: 'Item 3' }
  ];
  filteredItems: any[];

  // toggleSearch() {
  //   this.isSearchVisible = !this.isSearchVisible;
  // }

  filterItems(event) {
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(event.query.toLowerCase()));
  }

}


