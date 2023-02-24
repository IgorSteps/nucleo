import Material from "./material";

class MaterialReferenceNode {
        public m_Material: Material;
        public m_ReferenceCount: number = 1;

        constructor(material: Material) {
            this.m_Material = material;
        }
}

export default class MaterialManager {

    private static m_Materials: {[name: string]: MaterialReferenceNode} = {};

    private constructor(){

    }

    public static registerMaterial(material: Material): void {
        if(MaterialManager.m_Materials[material.name] === undefined) {
            MaterialManager.m_Materials[material.name] = new MaterialReferenceNode(material);
        }
    }

    public static getMaterial(materialName: string): Material {
        if(MaterialManager.m_Materials[materialName] === undefined) {
            return undefined;
        } else {
            MaterialManager.m_Materials[materialName].m_ReferenceCount++;
            return MaterialManager.m_Materials[materialName].m_Material;
        }
    }


    public static releaseMaterial(materialName: string): void {
        if(MaterialManager.m_Materials[materialName] === undefined) {
            console.warn("Can't release material that hasn't been registered");
        } else {
            MaterialManager.m_Materials[materialName].m_ReferenceCount--
            if(MaterialManager.m_Materials[materialName].m_ReferenceCount < 1){
                MaterialManager.m_Materials[materialName].m_Material.destroy();
                MaterialManager.m_Materials[materialName].m_Material = undefined;
                delete MaterialManager.m_Materials[materialName];
            }
        }
    }




}