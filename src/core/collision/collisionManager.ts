import CollisionComponent from "../components/collisionComponent";

export class CollisionData {
    public a: CollisionComponent;
    public b: CollisionComponent;
    public time: number;

    constructor(time: number, a: CollisionComponent, b: CollisionComponent) {
        this.time = time;
        this.a = a;
        this.b = b;
    }

}

export class CollisionManager {
    private static m_Components: CollisionComponent[] = [];
    private static m_CollisionData: CollisionData[] = [];
    private static m_TotalTime: number = 0;

    private constructor(){};

    public static registerCollisionComponent(c: CollisionComponent): void {
        CollisionManager.m_Components.push(c);
    }

    public static unregisterCollisionComponent(c: CollisionComponent): void {
        let idx = CollisionManager.m_Components.indexOf(c);
        if(idx !== -1) {
            CollisionManager.m_Components.slice(idx, 1);
        }
    }

    public static clear(): void {
        CollisionManager.m_Components.length = 0;
    }

    public static update(dt: number): void {
        CollisionManager.m_TotalTime += dt;

        for(let c = 0; c < CollisionManager.m_Components.length; ++c) {
            let component = CollisionManager.m_Components[c];

            for(let o = 0; o<CollisionManager.m_Components.length; ++o) {
                let other = CollisionManager.m_Components[o];
                // don't check against itself
                if(component === other ){
                    continue;
                }

                if(component.shape.intersects(other.shape)) {

                    // they are colliding
                    let exists: boolean = false;
                    for(let d=0; d<CollisionManager.m_CollisionData.length; ++d) {
                        let data = CollisionManager.m_CollisionData[d];
                        if((data.a === component && data.b === other) || (data.a === other && data.b === component)) {
                            // we have existing data - update it
                            component.onCollisionUpdate(other);
                            other.onCollisionUpdate(component);
                            data.time = CollisionManager.m_TotalTime;
                            exists = true;
                            break;
                        } 
                      
                    }

                    if(!exists) {
                        // create a collision
                        let collision = new CollisionData(CollisionManager.m_TotalTime, component, other);
                        component.onCollisionEntry(other);
                        other.onCollisionEntry(component);
                        this.m_CollisionData.push(collision); 
                    }
                }
            }
        }

        // Remove stale collision data
        let removeData: CollisionData[] = [];
        for(let d=0; d<CollisionManager.m_CollisionData.length; ++d) {
            let data = CollisionManager.m_CollisionData[d];
            if(data.time != CollisionManager.m_TotalTime) {
                // old collision data
                removeData.push(data);
                data.a.onCollisionExit(data.b);
                data.b.onCollisionExit(data.a);
            }
        }

        while(removeData.length !== 0) {
            let idx = CollisionManager.m_CollisionData.indexOf(removeData[0]); 
            CollisionManager.m_CollisionData.splice(idx, 1);
            removeData.shift();
        }

        // @TODO remove
        document.title = CollisionManager.m_CollisionData.length.toString();
    }


}