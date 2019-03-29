import { TestBed, inject } from '@angular/core/testing';

import { SelectionDataService } from './selection-data.service';

describe('SelectionDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionDataService]
    });
  });

  it('should be created', inject([SelectionDataService], (service: SelectionDataService) => {
    expect(service).toBeTruthy();
  }));
});
