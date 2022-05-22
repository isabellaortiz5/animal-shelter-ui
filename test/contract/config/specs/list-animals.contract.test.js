import { provider } from '../init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../../controllers';

describe('Animal Service', () => {

    beforeAll(async () => {
        await provider.setup();
    })

    describe('When a request to list all animals is made', () => {
        
        beforeAll(async () => {
            await provider.addInteraction({
                uponReceiving: 'a request to list all animals',
                state: "has animals",
                withRequest: {
                    method: 'GET',
                    path: '/animals'
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike(
                        {
                            name: Matchers.like('manchas'),
                            breed: Matchers.like("Bengali"),
                            gender: Matchers.like("Female"),
                            vaccinated: Matchers.boolean(true)
                        }
                    )
                }
            });
        });
        it('should return the correct data', async () => {
            const response = await AnimalController.list();
            expect(response.data).toMatchSnapshot();
            await provider.verify()
        });


    });

    describe('When a request to list an animal is made', () => {
        
        beforeAll(async () => {
            await provider.addInteraction({
                uponReceiving: 'a request to list an animal',
                state: "has an animal",
                withRequest: {
                    method: 'GET',
                    path: '/animals/Joy'
                },
                willRespondWith: {
                    status: 200,
                    body: (
                        {
                            name: "Joy",
                            breed: Matchers.like("Criollo"),
                            gender: Matchers.like("Male"),
                            vaccinated: Matchers.boolean(true)
                        }
                    )
                }
            });
        });
        it('should list and animal', async () => {
            const response = await AnimalController.getAnimal("Joy");
            expect(response.data).toMatchSnapshot();
            await provider.verify()
        });
    });

    describe('When a request to edit an animal is made', () => {
        let animalBody = {
            id: 1,
            name: "Joy",
            breed: "Criollo",
            gender: "Male",
            vaccinated: true,
            vaccines: ["rabia"]
          };
        beforeAll(async () => {
            await provider.addInteraction({
                uponReceiving: 'a request to edit an animal',
                state: "update animal",
                withRequest: {
                    method: 'PUT',
                    path: '/animals/Joy'
                },
                willRespondWith: {
                    status: 200,
                    body:
                         {
                            id: Matchers.like(1),
                            name: Matchers.like("Joy"),
                            breed: Matchers.like("Criollo"),
                            gender: Matchers.like("Male"),
                            vaccinated: Matchers.boolean(true),
                            vaccines: ["rabia"]
                        }
                }
            });
        });
    
        it('Animal edited', async () => {
            const response = await AnimalController.updateAnimal("Joy", animalBody);
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });

    })

    describe('When a request to delete an animal is made', () => {

        beforeAll(async () => {
            await provider.addInteraction({
                uponReceiving: 'a request to delete an animal',
                state: "deletes animals",
                withRequest: {
                    method: 'DELETE',
                    path: '/animals/Joy'
                },
                willRespondWith: {
                    status: 204
                }
            });
        });
    
        it('Animal deleted', async () => {
            const response = await AnimalController.delete("Joy");
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });
    })

    describe('When a request to add an animal is made', () => {
        
        let pact_body = {"name": "Joy",
                        "breed": "Bengali",
                        "gender": "Male",
                        "vaccinated": true
                        // "vaccines":["vac1","vac2"]
                    }
        beforeAll(async () => {
            await provider.addInteraction({
                uponReceiving: 'a request to add an animal',
                state: "adds an animals",
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    body: pact_body
                },
                willRespondWith: {
                    status: 201,
                    body: pact_body
                }
            });
        });
    
        it('Animal registered', async () => {
            const response = await AnimalController.register(pact_body);
            expect(response.data).toMatchSnapshot();
            await provider.verify();
        });
    })

    afterAll(() => provider.finalize());

});
