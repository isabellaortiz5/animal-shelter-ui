import { provider } from '../init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../../controllers';

describe('Animal Service', () => {
    describe('When a request to delete an animal is made', () => {

        // let pact_body = {"name": "Joy",
        // "breed": "Bengali",
        // "gender": "Male",
        // "vaccinated": true}
        


        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to delete an animal',
                state: "has animals",
                withRequest: {
                    method: 'DELETE',
                    path: '/animals/Joy'
                },
                willRespondWith: {
                    status: 200
                }
            });
        });
    
        it('Animal deleted', async () => {
            // AnimalController.register(pact_body);
            const response = await AnimalController.delete("Joy");
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });

        afterAll(() => provider.finalize());

    })
});

