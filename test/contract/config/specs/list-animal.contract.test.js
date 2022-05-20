import { provider } from '../init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../../controllers';

describe('Animal Service', () => {
    describe('When a request to list an animal is made', () => {
        
        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to list an animal',
                state: "has an animal",
                withRequest: {
                    method: 'GET',
                    path: '/animals/Joy'
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike(
                        {
                            name: Matchers.like('Joy'),
                            breed: Matchers.like("Criollo"),
                            gender: Matchers.like("Male"),
                            vaccinated: Matchers.boolean(true)
                        }
                    )
                }
            });
        });
        it('should return the correct data', async () => {
            const response = await AnimalController.getAnimal("Joy");
            expect(response.data).toMatchSnapshot();
            await provider.verify()
        });

        afterAll(() => provider.finalize());
    });
});