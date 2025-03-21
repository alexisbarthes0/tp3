import { Point } from "./point";
import { Rectangle } from "./rectangle";

export class Carre extends Rectangle{
    constructor(origin:Point, longueur:number) {
        super(origin,longueur,longueur);
    }

    public setLargeur(larg: number): void{
        super.setLargeur(larg);
        super.setLongueur(larg);
    }

    public setLongueur(long: number): void {
        super.setLargeur(long);
        super.setLongueur(long);
    }
}