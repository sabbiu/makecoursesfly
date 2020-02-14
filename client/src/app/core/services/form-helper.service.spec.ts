import { TestBed } from '@angular/core/testing';
import { FormHelperService } from './form-helper.service';

describe('FormHelperService', () => {
  let service: FormHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormHelperService],
    });

    service = TestBed.get(FormHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
