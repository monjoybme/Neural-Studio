# Canvas / Node Editor API

## Layers


- [x] Core Layers

| Name       | Implemented | Tested |
| ---------- | ----------- | ------ |
| Input      | ✔           | ✔      |
| Dense      | ✔           | ✔      |
| Activation | ✔           | ✔      |
| Embedding  | ✔           | ❌      |
| Masking    | ✔           | ❌      |
| Lambda     | ✔           | ❌      |

- [x] Convolution Layers

| Name            | Implemented | Tested |
| --------------- | ----------- | ------ |
| Conv1D          | ✔           | ✔      |
| Conv2D          | ✔           | ✔      |
| Conv3D          | ✔           | ✔      |
| SeparableConv1D | ✔           | ✔      |
| SeparableConv2D | ✔           | ✔      |
| DepthwiseConv2D | ✔           | ✔      |
| Conv2DTranspose | ✔           | ✔      |
| Conv3DTranspose | ✔           | ✔      |

- [x] Pooling Layers

| Name                   | Implemented | Tested |
| ---------------------- | ----------- | ------ |
| MaxPooling1D           | ✔           | ✔      |
| MaxPooling2D           | ✔           | ✔      |
| MaxPooling3D           | ✔           | ✔      |
| AveragePooling1D       | ✔           | ✔      |
| AveragePooling2D       | ✔           | ✔      |
| AveragePooling3D       | ✔           | ✔      |
| GlobalMaxPooling1D     | ✔           | ✔      |
| GlobalMaxPooling2D     | ✔           | ✔      |
| GlobalMaxPooling3D     | ✔           | ✔      |
| GlobalAveragePooling1D | ✔           | ✔      |
| GlobalAveragePooling2D | ✔           | ✔      |
| GlobalAveragePooling3D | ✔           | ✔      |

- [x] Recurrent Layers

| Name            | Implemented | Tested |
| --------------- | ----------- | ------ |
| LSTM            | ✔           | ❌      |
| GRU             | ✔           | ❌      |
| SimpleRNN       | ✔           | ❌      |
| TimeDistributed | ✔           | ❌      |
| Bidirectional   | ✔           | ❌      |
| ConvLSTM2D      | ✔           | ❌      |
| Base RNN        | ✔           | ❌      |

- [x] Regularization Layers

| Name                   | Implemented | Tested |
| ---------------------- | ----------- | ------ |
| Dropout                | ✔           | ❌      |
| SpatialDropout1D       | ✔           | ❌      |
| SpatialDropout2D       | ✔           | ❌      |
| SpatialDropout3D       | ✔           | ❌      |
| GaussianDropout        | ✔           | ❌      |
| GaussianNoise          | ✔           | ❌      |
| ActivityRegularization | ✔           | ❌      |
| AlphaDropout           | ✔           | ❌      |

- [x] Attention Layers

| Name               | Implemented | Tested |
| ------------------ | ----------- | ------ |
| MultiHeadAttention | ✔           | ❌      |
| Attention          | ✔           | ❌      |
| AdditiveAttention  | ✔           | ❌      |

- [x] Reshaping Layers

| Name          | Implemented | Tested |
| ------------- | ----------- | ------ |
| Reshape       | ✔           | ❌      |
| Flatten       | ✔           | ❌      |
| RepeatVector  | ✔           | ❌      |
| Permute       | ✔           | ❌      |
| Cropping1D    | ✔           | ❌      |
| Cropping2D    | ✔           | ❌      |
| Cropping3D    | ✔           | ❌      |
| UpSampling1D  | ✔           | ❌      |
| UpSampling2D  | ✔           | ❌      |
| UpSampling3D  | ✔           | ❌      |
| ZeroPadding1D | ✔           | ❌      |
| ZeroPadding2D | ✔           | ❌      |
| ZeroPadding3D | ✔           | ❌      |

- [x] Merging Layers

| Name        | Implemented | Tested |
| ----------- | ----------- | ------ |
| Concatenate | ✔           | ❌      |
| Average     | ✔           | ❌      |
| Maximum     | ✔           | ❌      |
| Minimum     | ✔           | ❌      |
| Add         | ✔           | ❌      |
| Subtract    | ✔           | ❌      |
| Multiply    | ✔           | ❌      |
| Dot         | ✔           | ❌      |

- [x] Locally-connected Layers

| Name               | Implemented | Tested |
| ------------------ | ----------- | ------ |
| LocallyConnected1D | ✔           | ❌      |
| LocallyConnected2D | ✔           | ❌      |

- [x] Activation Layers

| Name            | Implemented | Tested |
| --------------- | ----------- | ------ |
| ReLU            | ✔           | ❌      |
| Softmax         | ✔           | ❌      |
| LeakyReLU       | ✔           | ❌      |
| PReLU           | ✔           | ❌      |
| ELU             | ✔           | ❌      |
| ThresholdedReLU | ✔           | ❌      |

- [x] Build Layers

| Name    | Implemented | Tested |
| ------- | ----------- | ------ |
| Model   | ✔           | ✔      |
| Compile | ✔           | ✔      |
| Fit     | ✔           | ✔      |

- [x] Applications

| Name              | Implemented | Tested |
| ----------------- | ----------- | ------ |
| Xception          | ✔           | ✔      |
| VGG16             | ✔           | ✔      |
| VGG19             | ✔           | ✔      |
| ResNet50          | ✔           | ✔      |
| ResNet101         | ✔           | ✔      |
| ResNet152         | ✔           | ✔      |
| ResNet50V2        | ✔           | ✔      |
| ResNet101V2       | ✔           | ✔      |
| ResNet152V2       | ✔           | ✔      |
| InceptionV3       | ✔           | ✔      |
| InceptionResNetV2 | ✔           | ✔      |
| MobileNet         | ✔           | ✔      |
| MobileNetV2       | ✔           | ✔      |
| DenseNet121       | ✔           | ✔      |
| DenseNet169       | ✔           | ✔      |
| DenseNet201       | ✔           | ✔      |
| NASNetMobile      | ✔           | ✔      |
| NASNetLarge       | ✔           | ✔      |
| EfficientNetB0    | ✔           | ✔      |
| EfficientNetB1    | ✔           | ✔      |
| EfficientNetB2    | ✔           | ✔      |
| EfficientNetB3    | ✔           | ✔      |
| EfficientNetB4    | ✔           | ✔      |
| EfficientNetB5    | ✔           | ✔      |
| EfficientNetB6    | ✔           | ✔      |
| EfficientNetB7    | ✔           | ✔      |

- [x] Optimizers

| Name     | Implemented | Tested |
| -------- | ----------- | ------ |
| SGD      | ✔           | ✔      |
| RMSprop  | ✔           | ✔      |
| Adam     | ✔           | ✔      |
| Adadelta | ✔           | ✔      |
| Adagrad  | ✔           | ✔      |
| Adamax   | ✔           | ✔      |
| Nadam    | ✔           | ✔      |
| Ftrl     | ✔           | ✔      |

- [x] Callbacks

| Name                  | Implemented | Tested |
| --------------------- | ----------- | ------ |
| Callback              | ✔           | ✔      |
| ModelCheckpoint       | ✔           | ✔      |
| TensorBoard           | ✔           | ✔      |
| EarlyStopping         | ✔           | ✔      |
| LearningRateScheduler | ✔           | ✔      |
| ReduceLROnPlateau     | ✔           | ✔      |
| RemoteMonitor         | ✔           | ✔      |
| LambdaCallback        | ✔           | ✔      |
| TerminateOnNaN        | ✔           | ✔      |
| CSVLogger             | ✔           | ✔      |
| ProgbarLogger         | ✔           | ✔      |

## Editing Tools

- [x]  New Nodee
- [x]  New Edge
- [x]  Delete
- [x]  Clean Canvas

# Dataset Types / Problems

## Data Type

1. Image
    - [ ] Image Classification
    - [ ] Image Classification With Localization
    - [ ] Object Detection
    - [ ] Object Segmentation
    - [ ] Image Style Transfer
    - [ ] Image Colorization
    - [ ] Image Reconstruction
    - [ ] Image Super-Resolution
    - [ ] Image Synthesis

2. Text

    - [ ] Text Classification
    - [ ] Language Modeling
    - [ ] Speech Recognition
    - [ ] Caption Generation
    - [ ] Machine Translation
    - [ ] Document Summarization
    - [ ] Question Answering

3. CSV
    - [ ] CSVDataset 

## Dataset Parsers

- [x] CSV Dataset
- [ ] Image Dataset From CSVFile
- [ ] Text Dataset From CSVFIle
- [ ] CSV Parser
- [ ] Image Dataset From Directory
- [ ] Text Dataset From Directory

## Augmentation

- [ ] Image Augmentation