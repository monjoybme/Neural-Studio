const datasets = {
  datasets: {
    name: "Datasets",
    layers: [
      {
        name: "Dataset",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `"""
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
            type: "dataset",
            render: "dataset",
          },
        },
      },
      {
        name: "Image Dataset From Directory",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `#dataset id=__id__
  class Dataset:
      """
      Dataset will be used in training 

      The dataset object needs to have following attributes

      train_x : np.ndarray -> Training features
      train_y : np.ndarray -> Training labels 
      test_x : np.ndarray -> Testing features
      test_y : np.ndarray -> Testing labels

      validate : bool -> Weather use validation data or not

      Image dataset from directory
      
      the root folder needs to be in following pattern.
      
      root
      |_ train_folder
        |_ class_1
          |_ image1.jpg
          |_ ...
        |_ class_2
          |_ image1.jpg
          |_ ...
        |_ ...
      |_ test_folder
        |_ class_1
          |_ image1.jpg
          |_ ...
        |_ class_2
          |_ image1.jpg
          |_ ...
        |_ ...
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
          
          self.root_folder = "path" # Path to dataset folder
          self.train_name  = 'train' # Name of the train folder
          self.test_name   = 'val' # Name of the test folder
                  
          self.image_size = ( 224, 224, 3 ) # image size in ( height, width, channel ) format
          self.resize = True                # whether to resize the image after reading or not.
          
          self.show_progress = True

          # Make changed in the following code with the caution
          
          self.train_set = glob(pathlib.join(self.root_folder, self.train_name, "*", "*"))[::4]
          self.test_set  = glob(pathlib.join(self.root_folder, self.test_name, "*", "*"))[::4]
          
          self.train_labels = [ self.strip_label(path) for path in self.train_set ]
          self.test_labels  = [ self.strip_label(path) for path in self.test_set ]
          
          self.label_classes = list(set(self.train_labels + self.test_labels))
          self.n_label_classes = len(self.label_classes)
          
          if self.n_label_classes > 2:
              self.train_y = keras.utils.to_categorical(
                  np.array([ 
                      self.label_classes.index(label) 
                          for label 
                          in self.train_labels 
                  ]).reshape(-1,1 )
              )
              self.test_y = keras.utils.to_categorical(
                  np.array([ 
                      self.label_classes.index(label) 
                          for label 
                          in self.test_labels 
                  ]).reshape(-1,1 )
              )
              self.output_shape = ( self.image_size, self.n_label_classes )
          else:
              p, n = self.label_classes
              self.train_y = (np.array([ self.train_labels ]) == p).astype(np.uint8)
              self.test_y  = (np.array([ self.test_labels ]) == p).astype(np.uint8)
              self.output_shape = ( self.image_size, 1 ) 
              
          self.train_x = self.read_image_set_with_bar(self.train_set) if self.show_progress else self.read_image_set(self.train_set)
          self.test_x  = self.read_image_set_with_bar(self.test_set) if self.show_progress else self.read_image_set(self.test_set)
          
          _ = collect()
          
      def strip_label(self, path:str)->str:
          path, _ = pathlib.split(path,)
          _, label = pathlib.split(path)
          return label

      def read_image(self, path:str)->np.ndarray:
          im = cv2.imread(path, )
          im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
          h,w,c = self.image_size
          if self.resize:
              im = cv2.resize( im , ( h, w) , interpolation=cv2.INTER_AREA)
          return im
      
      def read_image_set(self, image_set:List[str] )->np.ndarray:
          images = np.zeros(shape = (len(image_set), *self.image_size), dtype=np.uint8)
          with ThreadPoolExecutor( max_workers=32, ) as executor:
              def set_image(args):
                  try:
                      idx, path = args
                      images[idx] = self.read_image(path)
                  except Exception as e:
                      print (e)
              res = executor.map(set_image, enumerate(image_set))
          return images
          
      def read_image_set_with_bar(self, image_set:List[str] )->np.ndarray:
          images = np.zeros(shape = (len(image_set), *self.image_size), dtype=np.uint8)
          with tqdm(total=len(image_set)) as bar:
              with ThreadPoolExecutor( max_workers=32, ) as executor:
                  def set_image(args):
                      try:
                          idx, path = args
                          images[idx] = self.read_image(path)
                          bar.update()
                      except Exception as e:
                          print (e)
                  res = executor.map(set_image, enumerate(image_set))
          return images
      
  # Do not change the anything.
  __id__ = Dataset()
  #end-dataset id=__id__`,
            type: "dataset",
            render: "dataset",
          },
        },
      },
      {
        name: "MNIST",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `"""
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
            type: "dataset",
            render: "dataset",
          },
        },
      },
      {
        name: "Boston Housing",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `"""
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
            type: "dataset",
            render: "dataset",
          },
        },
      },
      {
        name: "CIFAR10",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `"""
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
            type: "dataset",
            render: "dataset",
          },
        },
      },
      {
        name: "CIFAR100",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `"""
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
            type: "dataset",
            render: "dataset",
          },
        },
      },
      {
        name: "Fashion MNIST",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `"""
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
            type: "dataset",
            render: "dataset",
          },
        },
      },
      {
        name: "IMDB",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          dataset: {
            value: `"""
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
            type: "dataset",
            render: "dataset",
          },
        },
      },
    ],
  },
  training_utils:{
    name:"Training Utils",
    layers: []
  }
};

export default datasets;
