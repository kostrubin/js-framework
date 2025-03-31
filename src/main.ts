type VNodeProps = {
  [key: string]:
    | string
    | number
    | boolean
    | Function
    | undefined
    | VNode[]
    | string;
  children?: VNode[] | string;
};

type VNode = {
  tag: string;
  props?: VNodeProps;
};

class JsFramework {
  private root: HTMLElement;
  private currentVNode: VNode | null = null;

  constructor(rootSelector: string) {
    const root = document.querySelector(rootSelector);
    if (!root) {
      throw new Error("Root element not found");
    }
    this.root = root as HTMLElement;
  }

  public render(vnode: VNode) {
    if (!this.currentVNode) {
      this.root.appendChild(this.createElement(vnode));
    } else {
      this.updateElement(this.root, vnode, this.currentVNode);
    }
    this.currentVNode = vnode;
  }

  private createElement(vnode: VNode): HTMLElement {
    const el = document.createElement(vnode.tag);
    this.updateProps(el, vnode.props);

    if (vnode.props?.children) {
      this.renderChildren(el, vnode.props.children);
    }

    return el;
  }

  private renderChildren(parent: HTMLElement, children: VNode[] | string) {
    if (typeof children === "string") {
      parent.textContent = children;
    } else {
      children.forEach((child) => {
        parent.appendChild(this.createElement(child));
      });
    }
  }

  private updateElement(parent: HTMLElement, newVNode: VNode, oldVNode: VNode) {
    if (newVNode.tag !== oldVNode.tag) {
      parent.replaceChild(this.createElement(newVNode), parent.firstChild!);
      return;
    }
    this.updateProps(
      parent.firstChild as HTMLElement,
      newVNode.props,
      oldVNode.props
    );
    this.updateChildren(
      parent.firstChild as HTMLElement,
      newVNode.props?.children,
      oldVNode.props?.children
    );
  }

  private updateProps(
    el: HTMLElement,
    newProps?: VNodeProps,
    oldProps?: VNodeProps
  ) {
    newProps = newProps || {};
    oldProps = oldProps || {};
    for (const key in { ...oldProps, ...newProps }) {
      if (key === "children") continue;
      if (newProps[key] !== oldProps[key]) {
        if (key.startsWith("on") && typeof newProps[key] === "function") {
          (el as any)[key.toLowerCase()] = newProps[key];
        } else if (newProps[key] === undefined || newProps[key] === null) {
          el.removeAttribute(key);
        } else {
          el.setAttribute(key, String(newProps[key]));
        }
      }
    }
  }

  private updateChildren(
    parent: HTMLElement,
    newChildren?: VNode[] | string,
    oldChildren?: VNode[] | string
  ) {
    if (typeof newChildren === "string" || typeof oldChildren === "string") {
      if (newChildren !== oldChildren) {
        parent.textContent = newChildren as string;
      }
    } else if (Array.isArray(newChildren) && Array.isArray(oldChildren)) {
      const maxLength = Math.max(newChildren.length, oldChildren.length);
      for (let i = 0; i < maxLength; i++) {
        if (!newChildren[i]) {
          parent.removeChild(parent.childNodes[i]);
        } else if (!oldChildren[i]) {
          parent.appendChild(this.createElement(newChildren[i]));
        } else {
          this.updateElement(
            parent.childNodes[i] as HTMLElement,
            newChildren[i],
            oldChildren[i]
          );
        }
      }
    }
  }
}

const app = new JsFramework("#app");
const initialConfig: VNode = {
  tag: "div",
  props: {
    id: "wrapper",
    class: "class1",
    children: [{ tag: "p", props: { children: "Initial state" } }],
  },
};

app.render(initialConfig);

setTimeout(() => {
  const newConfig: VNode = {
    tag: "div",
    props: {
      id: "wrapper",
      class: "class2",
      children: [
        { tag: "p", props: { children: "Dynamically updated content" } },
      ],
    },
  };
  app.render(newConfig);
}, 2000);
