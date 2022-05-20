import { provider } from '../init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../../controllers';

describe('Animal Service', () => {
    describe('When a request to add an animal is made', () => {
        
        let pact_body = {"name": "Joy",
                        "breed": "Bengali",
                        "gender": "Male",
                        "vaccinated": true}
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to add an animal',
                state: "has animals",
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: pact_body
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: pact_body
                }
            });
        });
    
        it('Animal registered', async () => {
            const response = await AnimalController.register(pact_body);
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });

        afterAll(() => provider.finalize());

    })
});

