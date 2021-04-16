const datasets = {
    "name":"Input",
    "layers":[
        {
            "name":"Dataset",
            "type":{
                _class:"datasets",
                name:"Dataset",
            },
            "arguments":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.

All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""


#dataset id=__id__
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    batch_size : int -> Batch size
    epochs : int -> Number of epochs
    batches : int -> Number of batches ( Will be calculated automatically )
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """

        self.train_x = None
        self.train_y = None
        self.test_x = None
        self.test_y = None

# Do not change the anything.
__id__ = Dataset()
#end-dataset id=__id__
`,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
        {
            "name":"MNIST",
            "type":{
                _class:"datasets",
                name:"Dataset",
            },
            "arguments":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.
All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""

#dataset id=__id__
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    batch_size : int -> Batch size
    epochs : int -> Number of epochs
    batches : int -> Number of batches ( Will be calculated automatically )
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """

        (X,Y),(x,y) = keras.datasets.mnist.load_data()

        self.train_x = X.reshape(-1,784) / 255
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = X.reshape(-1,784) / 255
        self.test_y = keras.utils.to_categorical(Y)
    
# Do not change the anything.
__id__ = Dataset()
#end-dataset id=__id__
                    `,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
        {
            "name":"Boston Housing",
            "type":{
                _class:"datasets",
                name:"Dataset",
            },
            "arguments":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.
All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""

#dataset id=__id__
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    batch_size : int -> Batch size
    epochs : int -> Number of epochs
    batches : int -> Number of batches ( Will be calculated automatically )
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """
        
        (X,Y),(x,y)  = keras.datasets.boston_housing.load_data()
        
        self.train_x = X 
        self.train_y = Y
        self.test_x = x 
        self.test_y = y
        
        self.x_shape = (13,)

# Do not change the anything.
__id__ = Dataset()
#end-dataset id=__id__
                    `,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
        {
            "name":"CIFAR10",
            "type":{
                _class:"datasets",
                name:"Dataset",
            },
            "arguments":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.
All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""

#dataset id=__id__
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    batch_size : int -> Batch size
    epochs : int -> Number of epochs
    batches : int -> Number of batches ( Will be calculated automatically )
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """
        
        (X,Y),(x,y)  = keras.datasets.cifar10.load_data()
        
        self.train_x = X.reshape(-1, 32, 32, 3) / 255
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1, 32, 32, 3) / 255
        self.test_y = keras.utils.to_categorical(y)
        
        self.x_shape = (32, 32, 3)
    
# Do not change the anything.
__id__ = Dataset()
#end-dataset id=__id__
                    `,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
        {
            "name":"CIFAR100",
            "type":{
                _class:"datasets",
                name:"Dataset",
            },
            "arguments":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.
All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""

#dataset id=__id__
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """
        
        (X,Y),(x,y)  = keras.datasets.cifar100.load_data()
        
        self.train_x = X.reshape(-1, 32, 32, 3) / 255
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1, 32, 32, 3) / 255
        self.test_y = keras.utils.to_categorical(y)
        
        self.x_shape = (32, 32, 3)
    
# Do not change the anything.
__id__ = Dataset()
#end-dataset id=__id__
                    `,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
        {
            "name":"Fashion MNIST",
            "type":{
                _class:"datasets",
                name:"Dataset",
            },
            "arguments":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.
All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""

#dataset id=__id__
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """
        
        (X,Y),(x,y)  = keras.datasets.fashion_mnist.load_data()
        
        self.train_x = X.reshape(-1, 28, 28, 3) / 255
        self.train_y = keras.utils.to_categorical(Y)
        self.test_x = x.reshape(-1, 28, 28, 3) / 255
        self.test_y = keras.utils.to_categorical(y)
        
        self.x_shape = (28, 28, 1)
    
# Do not change the anything.
__id__ = Dataset()
#end-dataset id=__id__
                    `,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
        {
            "name":"IMDB",
            "type":{
                _class:"datasets",
                name:"Dataset",
            },
            "arguments":{
                "dataset":{
                    value:`"""
Note : Don't change dataset id.
All the required packages have been imported with their standard namespaces.

tensorflow as tf
keras as keras
pandas as pd
numpy as np

from sklearn.model_selection , train_test_split
"""

#dataset id=__id__
class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """
        
        (X,Y),(x,y)  = keras.datasets.imdb.load_data()
        
        self.train_x = X
        self.train_y = Y
        self.test_x = x
        self.test_y = y
        
        self.x_shape = (None,)
    
# Do not change the anything.
__id__ = Dataset()
#end-dataset id=__id__
                    `,
                    type:"dataset",
                    render:"dataset",
                },
            },
        },
    ]
}

export default datasets;

