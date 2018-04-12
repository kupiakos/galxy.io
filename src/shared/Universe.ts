import {Planet} from "./Planet";

export class Universe {
    planetList : Array<Planet>;
    rootPlanet : Planet;

    /*
    Updates all planets in the universe with the current elapsedTime.

    TODO: Handle how planets die
    */
    public updatePlanets(elapsedTime: number){

        // update loop
        for (var planet of this.planetList){

            planet.update(elapsedTime);

        }

        // collision loop
        for (var planet1 of this.planetList){

            for(var planet2 of this.planetList){

                if(planet1.getDistanceToPlanet(planet2) <=
                    planet1.getSize() + planet2.getSize()){
                    
                    if(planet1.getMass() > planet2.getMass())
                    {
                        planet1.addMass(planet2.getMass());
                        // kill planet 2 and let user know
                    }

                    else if(planet2.getMass() > planet1.getMass())
                    {
                        planet2.addMass(planet1.getMass());
                        // kill planet 1 and let user know
                    }
                    //else planets pass each other by (for now!)
                }
            }
        } // end of collision loop
    }

    /*
    Adds planet to the universe
    */
    public addPlanet(planet: Planet)
    {
        planet.parentBody = this.rootPlanet;
        this.planetList.push(planet);
    }

    /*
    Removes planet from the universe
    TODO: Implement
    */
    public removePlanet(planet: Planet)
    {

    }
}
