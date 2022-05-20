import { provider } from '../init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../../controllers';

describe('Animal Service', () => {
    describe('When a request to edit an animal is made', () => {
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to edit an animal',
                state: "update animal",
                withRequest: {
                    method: 'PUT',
                    path: '/animals/Joy',
                },
                willRespondWith: {
                    status: 200,
                    body:{
                        name: Matchers.like('Joy'),
                        breed: Matchers.like("Bengali"),
                        gender: Matchers.like("Female"),
                        vaccinated: Matchers.boolean(true)
                    }
                }
            });
        });
    
        it('Animal edited', async () => {
            const response = await AnimalController.updateAnimal("Joy");
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });

        afterAll(() => provider.finalize());

    })
});
