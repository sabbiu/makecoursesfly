import { Component, OnInit, Input } from '@angular/core';
import { UrlMetadata } from '../../posts/posts.interfaces';

@Component({
  selector: 'app-link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.scss'],
})
export class LinkPreviewComponent implements OnInit {
  @Input() data: UrlMetadata;

  constructor() {}

  ngOnInit() {}
}
