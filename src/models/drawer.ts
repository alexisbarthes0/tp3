import { Cercle } from "./cercle";
import { FormeGeometrique } from "./forme-géométrique";
import { Rectangle } from "./rectangle";
import { Triangle } from "./triangle";
import { Carre } from "./carre";
/**
    La classe Drawer (dessinatrice) est capable d'interagir 
    avec un contexte de rendu 2D d'un element HTML `canvas`,
    afin de dessiner dans un canvas des objets de la classe Forme Geométrique
*/
export class Drawer {
    /**
     * la propriété context stocke le
     * [`contexte de rendu`](https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D)
     * d'un élément HTML canvas, afin de pouvoir dessiner dessus
     */
    private context: CanvasRenderingContext2D;
    /**
     * la propriété height stocke la hauteur du canvas, en pixels
     */
    private height: number;
    /**
     * la propriété width stocke la largeur du canvas, en pixels
     */
    private width: number;

    /**
     * Constructeur de la classe
     * stocke les infos relatives à l'élément canvas afin de pouvoir
     * dessiner dessus
     */
    constructor(
        context: CanvasRenderingContext2D,
        height: number,
        width: number,
    ) {
        this.context = context;
        this.height = height;
        this.width = width;
        console.log("Initating drawer on canvas", height, width);
    }

    /**
     * méthode privée pour dessiner un cercle
     * @param {Cercle} c le cercle à dessiner
     * @param {string} color la couleur à utiliser (noir par défaut)
     */
    private drawCircle(c: Cercle, color = "#000") {
        const oldStyle = this.context.strokeStyle;
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.arc(
            this.width / 2 + c.getOrigin().x,
            this.height / 2 - c.getOrigin().y,
            c.getRayon(),
            0,
            360,
        );
        this.context.stroke();
        this.context.strokeStyle = oldStyle;
    }

    /**
     * méthode privée pour dessiner un rectangle
     * @param {Rectangle} r le rectangle à dessiner
     * @param {string} color la couleur à utiliser  (noir par défaut)
     */
    private drawRectangle(r: Rectangle, color = "#000") {
        const oldStyle = this.context.strokeStyle;
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.strokeRect(
            this.width / 2 + r.getOrigin().x,
            this.height / 2 - r.getOrigin().y,
            r.getLargeur(),
            -r.getLongueur(),
        );
        this.context.strokeStyle = oldStyle;
    }
    /**
     * méthode privée pour dessiner un rectangle
     * @param {Triangle} t le rectangle à dessiner
     * @param {string} color la couleur à utiliser (noir par défaut)
     * @param {CanvasLineJoin} lineJoin le type de jointure entre les points à utiliser (pointu par défaut)
     */
    private drawTriangle(
        t: Triangle,
        color = "#000",
        lineJoin: CanvasLineJoin = "miter",
    ) {
        const oldStyle = this.context.strokeStyle;
        const oldLineJoin = this.context.lineJoin;

        this.context.strokeStyle = color;
        this.context.lineJoin = lineJoin;
        this.context.beginPath();
        this.context.moveTo(
            this.width / 2 + t.getPoint1().x,
            this.height / 2 - t.getPoint1().y,
        );
        this.context.lineTo(
            this.width / 2 + t.getPoint2().x,
            this.height / 2 - t.getPoint2().y,
        );
        this.context.lineTo(
            this.width / 2 + t.getPoint3().x,
            this.height / 2 - t.getPoint3().y,
        );
        this.context.closePath();
        this.context.stroke();
        this.context.strokeStyle = oldStyle;
        this.context.lineJoin = oldLineJoin;
    }

    /**
     * cette méthode permet de dessiner n'importe quelle forme géométrique, en appelant les méthodes privées
     * appropriés selon la classe de l'objet fournie en paramètre
     */
    public drawShape(shape: FormeGeometrique) {
        /*  en regardant le constructeur d'un objet (en fonction de sa propriété constructor)
            on peut faire des comportements différents selon la classe de l'objet !
         */
        switch (shape.constructor) {
            case Triangle:
                this.drawTriangle(shape as Triangle);
                break;
            case Carre:
            case Rectangle:
                this.drawRectangle(shape as Rectangle);
                break;
            case Cercle:
                this.drawCircle(shape as Cercle);
                break;

            // A COMPLETER POUR LE CARRE
            default:
                break;
        }
    }
}
