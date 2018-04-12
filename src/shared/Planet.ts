import {Orbit} from "./Orbit";

export const GravitationConstant = 6.674e-11;

export class Planet {

    Id: number;
    parentBody: Planet;
    mass: number;
    position: [number, number];
    velocity: [number, number];

    public update(elapsedTime: number): void
    {
        this.acceleratePlanetByGravity(elapsedTime);
        this.updatePosition(elapsedTime);
    }

    private updatePosition(elapsedTime: number) : void
    {
        this.position = [this.position[0]*elapsedTime, this.position[1]*elapsedTime];
    }

    public accelerate(force: [number, number])
    {
        this.velocity = [this.velocity[0] + force[0], this.velocity[1] + force[1]];
    }

    private acceleratePlanetByGravity(elapsedTime: number) : void
    {
        let gravityForce = elapsedTime *
            this.parentBody.getGravitationForce(this, this.getDistanceToParent());
        
        let gravityVector = [this.position[0] - this.parentBody.position[0],
                            this.position[1] - this.parentBody.position[1]];

        let magnitude = this.getDistance(this.position, this.parentBody.position);

        let unitGravityVector = [gravityVector[0]/magnitude, gravityVector[1]/magnitude];

        let finalGravityVector = [unitGravityVector[0]*gravityForce, unitGravityVector[1]*gravityForce];
       
        this.velocity = [this.velocity[0] + finalGravityVector[0], this.velocity[1] + finalGravityVector[1]];
    }    

    private getDistance(a: [number, number], b: [number, number]) : number
    {
        let distance = Math.sqrt(
            ((a[0] - b[0]) *
             (a[0] - b[0])) +
            ((a[1] - b[1]) *
             (a[1] - b[1])));

        return distance;
    }

    private getDistanceToParent() : number
    {
        return this.getDistance(this.parentBody.position, this.position);
    }

    public getGravitationForce(planet: Planet, distance: number) : number
    {
        let force = GravitationConstant * (this.mass * planet.mass) / (distance * distance);
        return force;
    }

    public sphereOfInfluence() : number
    {
        // Minimum force to still be in sphere of influence.
        let force = 0.005;

        //We'll ignore the mass of children in this to keep a constant sphere of influence size
        //for all children.
        let radius = Math.sqrt(GravitationConstant * this.mass / force);
        return radius;
    }
    
}
