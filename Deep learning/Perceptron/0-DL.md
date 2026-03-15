## ==Deep Learning==

Deep Learning is a subfield of **Machine Learning** that uses **neural networks with many layers** to learn patterns from large amounts of data. It is inspired by the structure and functioning of the **human brain**, where neurons are connected and transmit signals.

In deep learning, a model automatically learns **features and representations** from raw data without manual feature engineering. The word _deep_ refers to the presence of **multiple hidden layers** in the neural network.

Traditional machine learning often requires manual feature extraction, while deep learning models can learn hierarchical features directly from the data.

Example:

- Image recognition: A deep learning model can automatically learn edges, shapes, and objects from images.
    
- Speech recognition: Converting voice to text (e.g., virtual assistants).
    
- Natural Language Processing: Language translation, chatbots, and text generation.
    

Key Components:

- Input Layer: Receives raw data.
    
- Hidden Layers: Perform feature extraction and transformation.
    
- Output Layer: Produces the final prediction or classification.
    

Example Workflow:

1. Input data is fed into the network.
    
2. Each layer processes the data using weights, biases, and activation functions.
    
3. The network produces an output.
    
4. The model adjusts its parameters using **backpropagation** and **gradient descent** to minimize error.
    

---

## ==Types of Neural Networks==

### 1. Feedforward Neural Network (FNN)

A Feedforward Neural Network is the **simplest type of neural network** where information flows in one direction: from the input layer to the output layer. There are no cycles or feedback connections.

Characteristics:

- Data moves only forward.
    
- Used for basic classification and regression tasks.
    

Example:

- Predicting house prices based on features like size, location, and number of rooms.
    

---

### 2. Convolutional Neural Network (CNN)

Convolutional Neural Networks are specialized neural networks designed for **processing grid-like data**, especially images.

They use **convolutional layers** to automatically detect spatial features such as edges, textures, and shapes.

Characteristics:

- Uses filters (kernels) to scan images.
    
- Reduces parameters compared to fully connected networks.
    
- Highly effective for computer vision tasks.
    

Example:

- Image classification (cats vs dogs).
    
- Face recognition.
    
- Medical image analysis.
    

---

### 3. Recurrent Neural Network (RNN)

Recurrent Neural Networks are designed for **sequential data**, where previous information influences the next prediction.

They contain loops that allow information to persist across time steps.

Characteristics:

- Maintains a hidden state that carries information from previous inputs.
    
- Suitable for time-dependent data.
    

Example:

- Language modeling.
    
- Speech recognition.
    
- Stock price prediction.
    

---

### 4. Long Short-Term Memory Network (LSTM)

LSTM is a special type of RNN designed to solve the **vanishing gradient problem** in traditional RNNs. It can remember information for longer periods.

It uses special structures called **gates** (input gate, forget gate, output gate) to control the flow of information.

Example:

- Machine translation.
    
- Text generation.
    
- Speech processing.
    

---

### 5. Transformer Networks

Transformers are modern neural networks designed for **handling sequential data without recurrence**. They rely on a mechanism called **self-attention**, which allows the model to understand relationships between different parts of the input.

Characteristics:

- Processes sequences in parallel.
    
- Captures long-range dependencies efficiently.
    
- Forms the foundation of modern language models.
    

Example:

- Language models like large-scale chatbots.
    
- Text summarization.
    
- Question answering systems.
    

---

### ==Simple Comparison==

| Neural Network | Best For                   | Example                      |
| -------------- | -------------------------- | ---------------------------- |
| Feedforward NN | Basic prediction           | House price prediction       |
| CNN            | Image data                 | Image classification         |
| RNN            | Sequential data            | Speech recognition           |
| LSTM           | Long sequences             | Language translation         |
| Transformer    | Large-scale language tasks | Chatbots and text generation |

---

## ==Perceptron==

A **Perceptron** is the **simplest type of artificial neural network** and is considered the **basic building block of deep learning models**. It was introduced by **Frank Rosenblatt in 1957**. A perceptron is mainly used for **binary classification problems**, where the output can be either **0 or 1**.

A perceptron takes multiple inputs, multiplies each input by a corresponding weight, adds a bias term, and then passes the result through an activation function to produce the final output.

---

## ==Structure of a Perceptron==

A perceptron consists of the following components:

![[perceptron.png]]
### 1. Inputs (x₁, x₂, ..., xₙ)

Inputs represent the features of the data.  
Each input corresponds to one feature.

Example:

- For house prediction:
    
    - x₁ = number of rooms
        
    - x₂ = house size
        

---

### 2. Weights (w₁, w₂, ..., wₙ)

Weights determine the **importance of each input feature**.  
Each input has a corresponding weight.

If a weight is large, that input has a stronger influence on the output.

Example:

- If predicting house price:
    
    - w₁ may represent importance of number of rooms
        
    - w₂ may represent importance of size
        

---

### 3. Bias (b)

Bias is an additional parameter added to the weighted sum.  
It helps shift the decision boundary so that the model can better fit the data.

Without bias, the decision boundary would always pass through the origin.

---

### 4. Weighted Sum (Linear Combination)

The perceptron first calculates a **linear combination** of inputs and weights.

Formula:

```
z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
```

This operation is also known as the **dot product** between the input vector and the weight vector.

Example:

If  
```
x₁ = 2, x₂ = 3  
w₁ = 0.5, w₂ = 0.2  
b = 1
```

Then:

```
z = (0.5 × 2) + (0.2 × 3) + 1  
z = 1 + 0.6 + 1  
z = 2.6
```

---

### 5. Activation Function

The result **z** is passed into an **activation function** which converts the value into a specific range.

In the classical perceptron, a **step function** is commonly used.

Step Function:

```
Output = 1 if z ≥ 0  
Output = 0 if z < 0
```

This allows the perceptron to perform **binary classification**.

Example:

- Spam email detection
    
- Yes / No prediction
    
- True / False classification
    

---

## ==Mathematical Representation==

Input Vector:

```
x = [x₁, x₂, x₃, ..., xₙ]
```

Weight Vector:

```
w = [w₁, w₂, w₃, ..., wₙ]
```

Weighted Sum:

```
z = w · x + b
```

Output:

```
y = f(z)
```
Where **f** is the activation function.

---

## ==Example of Perceptron==

Suppose we want to build a simple **pass/fail prediction model**.

Inputs:

- x₁ = hours studied
    
- x₂ = attendance
    

Weights:

- w₁ = 0.6
    
- w₂ = 0.3
    

Bias:

- b = -0.5
    

Formula:

z = (0.6 × x₁) + (0.3 × x₂) - 0.5

If z ≥ 0 → Pass  
If z < 0 → Fail

---

## ==Limitation of Perceptron==

A perceptron can only solve **linearly separable problems**.

Linearly separable means that the data can be separated using a **straight line (or hyperplane)**.

Example:

- AND gate → solvable
    
- OR gate → solvable
    
- XOR gate → **not solvable with a single perceptron**
    

Because of this limitation, modern neural networks use **multiple layers (multi-layer perceptrons)**.

---

## Neuron vs Perceptron

![[NeuronVsPerceptron.png]]


