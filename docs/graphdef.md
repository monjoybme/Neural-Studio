```ts
graphdef {
    train_config{
        model{
            name : Model
        }
    }   
    custom_node_def [
        
    ]
}

app_config {

}

workspace_config {

}
```

Node definitions.

### Layer Node

```ts
layer{
    type{
        name : name,
        object_clas : layers
    }
}
```
```python
layer_id = layers.Name(
    {arguments}
)( inbound ) #end-{layer_id}
```
### Optimizer
```ts
optimizer{
    type{
        name : name,
        object_clas : optimizers
    }
}
```
```python
layer_id = optimizers.Name(
    {arguments}
) #end-{layer_id}
```
### Callback
```ts
callback{
    type{
        name : name,
        object_clas : callbacks
    }
}
```
```python
layer_id = callbacks.Name(
    {arguments}
) #end-{layer_id}
```
### Build Tools
```ts
build_tool{
    type{
        name : name,
        object_clas : build_tools
    }
}
```
```python
layer_id = model?.name(
    {arguments}
) #end-{layer_id}
```
### Custom Node Def
```ts
custom_node_def{
    type{
        name : name,
        object_clas : CustomDef
    }
}
```
```python
def custom_node_def({arguments}):
    ...
```
### Custom Node 
```ts
custom_node{
    type{
        name : name,
        object_clas : CustomNode
    }
}
```
```python
node_id = custom_node_def(
    {arguments}
) #end-{node_id}
```