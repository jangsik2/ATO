import * as dto from './application.dto';
import { ApplicationService } from './application.service';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    getApplication(requestData: dto.getApplicationDto): Promise<dto.dynamoDbApplication>;
}
