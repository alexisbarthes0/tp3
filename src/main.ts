import { Cercle } from "./models/cercle";
import { Drawer } from "./models/drawer";
import { FormeGeometrique } from "./models/forme-géométrique";
import { Point } from "./models/point";
import { Rectangle } from "./models/rectangle";
import { Triangle } from "./models/triangle";
import { Carre } from "./models/carre";
const shapeProps = document.querySelectorAll(".shape-props");
const fieldsetShapeProps = document.querySelector("#fieldset-shape-props");
const shapesDescriptionElement = document.querySelector(
    "#shapes-description",
) as HTMLElement;
const hideAllProps = () => {
    shapeProps.forEach((element) => element.classList.remove("active"));
};
hideAllProps();
let shapes: FormeGeometrique[] = [];
let drawer: Drawer;
const canvas = document.querySelector("canvas");
const ctx = canvas?.getContext("2d");

const shapeTypeSelect = document.querySelector(
    "#shapeType",
) as HTMLSelectElement;
shapeTypeSelect?.addEventListener("change", (event: Event) => {
    const newValue = (event.target as HTMLSelectElement)?.value;
    console.log("value has changed : ", newValue);
    hideAllProps();
    if (newValue.length) {
        fieldsetShapeProps?.classList.add("active");
        document.querySelector(`#${newValue}-props`)?.classList.add("active");
    } else {
        fieldsetShapeProps?.classList.remove("active");
    }
});

/**
 * Cette fonction va réinitialiser le canvas,
 * mettre à jour la liste des formes dessinées
 * et dessiner chaque forme
 */
const computeShapes = () => {
    shapesDescriptionElement.innerHTML = "";
    shapesDescriptionElement.classList.remove("active");
    if (shapes.length) {
        const ul = document.createElement("ul");
        shapes.forEach((shape) => {
            const li = document.createElement("li");
            li.innerText = shape.toString();
            ul.appendChild(li);
            drawer.drawShape(shape);
        });
        shapesDescriptionElement.appendChild(ul);
        shapesDescriptionElement.classList.add("active");
    }
};

const initCanvas = () => {
    shapes = [];
    computeShapes();
    if (ctx && canvas) {
        const { width, height } = canvas;
        console.log("init canvas", width, height);
        drawer = new Drawer(ctx, height, width);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "white";
        ctx.font = "12px serif";
        ctx.strokeStyle = "#ccc";
        ctx.fillRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.moveTo(width - 10, height / 2 - 10);
        ctx.lineTo(width, height / 2);
        ctx.moveTo(width - 10, height / 2 + 10);
        ctx.lineTo(width, height / 2);
        ctx.moveTo(width / 2, height);
        ctx.lineTo(width / 2, 0);
        ctx.moveTo(width / 2 - 10, 15);
        ctx.lineTo(width / 2, 0);
        ctx.moveTo(width / 2 + 10, 15);
        ctx.lineTo(width / 2, 0);
        ctx.stroke();
        // write legend
        ctx.fillStyle = "black";
        ctx.font = "16px Calibri";
        ctx.fillText("X", width - 25, height / 2 + 15);
        ctx.fillText("Y", width / 2 + 5, 25);
        ctx.fillText("0", width / 2 + 5, height / 2 + 15);
    }
};
initCanvas();

const form = document.getElementsByTagName("form").item(0) as HTMLFormElement;
const inputs = [
    ...form?.querySelectorAll("input,select"),
] as HTMLInputElement[];

/**
 * Fonction de validation du formulaire.
 * Au lieu d'envoyer une requête à un serveur,
 * ce formulaire va intéragir avec l'élément HTML canvas
 * et dessiner des formes géométriques dans le repère orthoormé
 */
form.addEventListener("submit", (event) => {
    /* la fonction preventDefault() permet d'annuler le
       comportement par défaut du formulaire, 
       c'est-à-dire envoyer une requête au serveur
    */
    event.preventDefault();
    /* on va réutiliser la variable inputs et ne prendre 
       que les inputs dont l'élement parent porte
       la classe HTML `active`
    */
    const activeInputs = inputs.filter((e) =>
        e.parentElement?.classList.contains("active"),
    );
    /* on transforme la liste d'éléments actifs en un objet 
       dont chaque propriété a comme non l'attribut `name`, 
       et comme valeur la valeur de l'input 
    */
    const params = activeInputs
        .map((i) => ({
            /* si l'input est de type number, on peut utiliser la propriété `valueAsNumber` 
               qui renvoie la valeur en tant que number et non en tant que string (par défaut)
             */
            [i.name]: i.type === "number" ? i.valueAsNumber : i.value,
        }))
        // on réduit le tableau en un unique objet
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    console.log(params);
    let newShape: FormeGeometrique | null = null;
    /* on utilise un switch (qui va choisir quel bloc exécuter selon la valeur donnée en paramètre)
       cf. https://www.tutorialsteacher.com/typescript/typescript-switch 
       On va créer différemment la forme géométrique selon son type
    */
    switch (shapeTypeSelect.value) {
        /*  cas du cercle : on construit un objet de la classe Cercle
            à partir des paramètres du formulaire 
        */
        case "circle":
            newShape = new Cercle(
                new Point(params.centerX as number, params.centerY as number),
                Number(params.radius),
            );
            break;
        /*  cas du rectangle : on construit un objet de la classe Rectangle
            à partir des paramètres du formulaire 
        */
        case "rectangle":
            newShape = new Rectangle(
                new Point(params.originX as number, params.originY as number),
                params.length as number,
                params.width as number,
            );
            break;
        /*  
            cas du triangle : on construit un objet de la classe Triangle
            à partir des paramètres du formulaire 
        */
        case "triangle":
            newShape = new Triangle(
                new Point(params.p1x as number, params.p1y as number),
                new Point(params.p2x as number, params.p2y as number),
                new Point(params.p3x as number, params.p3y as number),
            );
            break;
        /*  
            cas du carré : A IMPLEMENTER
         */
        case "square":
            newShape = new Carre(
                new Point(params.originX as number, params.originY as number), params.length as number
            );
            break;
        case null:
        default:
            break;
    }
    if (newShape) {
        shapes.push(newShape);
    }
    computeShapes();
});
(window as any)["initCanvas"] = initCanvas;
