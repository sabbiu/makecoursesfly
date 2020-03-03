import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/posts/post.model';
import { Feed } from '../feed.interfaces';

@Component({
  selector: '[app-feed-item]',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss'],
})
export class FeedItemComponent implements OnInit {
  @Input() feed: Feed;

  constructor() {}

  ngOnInit() {}
}
