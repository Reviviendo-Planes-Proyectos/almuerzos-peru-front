import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService sin HttpClientTestingModule', () => {
  let service: ApiService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    service = new ApiService(httpClientMock);
  });

  it('debe llamar a HttpClient.get con la URL correcta', () => {
    const mockResponse = { success: true };
    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.getHealth().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(httpClientMock.get).toHaveBeenCalledWith('https://almuerzos-peru.fly.dev/api/v1/health');
    });
  });
});
