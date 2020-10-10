import matplotlib.pyplot as plt
import numpy as np


x1 = np.arange(-5, 6, 1)
y1 = np.ones(11) * -5

x2 = np.ones(11) * 5
y2 = np.arange(-5, 6, 1)

x3 = np.flip(x1)
y3 = np.ones(11) * 5

x4 = np.ones(11) * -5
y4 = np.flip(y2)

X = np.append(x1, x2)
X = np.append(X, x3)
X = np.append(X, x4)

Y = np.append(y1, y2)
Y = np.append(Y, y3)
Y = np.append(Y, y4)

xMx = 0.
xMy = 0.0
xMxx = 0.
xMxy = 0.
xMyy = 0.1
xMxxx = 0.
xMxxy = 0.
xMxyy = 0.0
xMyyy = 0.

yMy = 0.
yMx = 0.
yMyy = 0.
yMxy = 0.



X2 = X + X*xMx + Y*xMy + X*Y*xMxy + X*X*xMxx + Y*Y*xMyy + X*X*X*xMxxx + X*X*Y*xMxxy + X*Y*Y*xMxyy + Y*Y*Y*xMyyy
Y2 = Y + Y*yMy + X*yMx + X*Y*yMxy + Y*Y*yMyy

fig = plt.figure()

plt.plot(X,Y, '-')
plt.plot(X2,Y2, '.')

plt.show()