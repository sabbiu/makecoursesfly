import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  q = '';
  path: string;
  PATHS = {
    POSTS: 'posts',
    TAGS: 'tags',
    PEOPLE: 'people',
  };

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.q = this.route.snapshot.queryParams.q || '';
    this.queryParamsChanged();
    const url = this.route.snapshot.url;
    this.path = url[url.length - 1].path;

    this.route.queryParams.subscribe(queryParams => {
      this.q = queryParams.q;
      this.queryParamsChanged();
    });

    this.route.url.subscribe(url => {
      this.path = url[url.length - 1].path;
    });
  }

  queryParamsChanged() {
    switch (this.path) {
      case this.PATHS.POSTS:
        this.searchService.postFilterOverride$.next({ search: this.q });
      case this.PATHS.TAGS:
        this.searchService.tagFilterOverride$.next({ search: this.q });
      case this.PATHS.PEOPLE:
        this.searchService.peopleFilterOverride$.next({ search: this.q });
    }
  }

  onSubmit() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.q },
    });
  }
}
