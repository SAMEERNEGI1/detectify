import argparse
import yaml
from pathlib import Path
import torch
from ultralytics import YOLO

def parse_opt():
    parser = argparse.ArgumentParser()
    parser.add_argument('--img-size', type=int, default=640, help='size of the input images')
    parser.add_argument('--batch-size', type=int, default=16, help='batch size for training')
    parser.add_argument('--epochs', type=int, default=50, help='number of epochs for training')
    parser.add_argument('--data', type=str, required=True, help='path to dataset YAML file')
    parser.add_argument('--weights', type=str, default='yolov8s.pt', help='initial weights path')
    parser.add_argument('--device', type=str, default='0', help='CUDA device id (default is 0)')

    opt = parser.parse_args()
    return opt

def train():
    # Parse command-line arguments
    opt = parse_opt()

    # Load the dataset YAML file
    with open(opt.data, 'r') as f:
        data = yaml.safe_load(f)

    # Initialize the YOLO model with specified weights
    model = YOLO(opt.weights)

    # Train the model
    model.train(
        data=opt.data,                  # Path to data.yaml file
        imgsz=opt.img_size,              # Image size
        batch=opt.batch_size,            # Batch size
        epochs=opt.epochs,               # Number of epochs
        device='cpu',               # CUDA device
        workers=8,                       # Number of workers for data loading
        project='runs/train',            # Project directory where results will be saved
        name='exp',                      # Experiment name (folder name)
        exist_ok=True,                   # Overwrite if folder already exists
    )

    # After training, save the best weights and results in the 'runs/train/exp' folder
    print(f"Training complete. Best weights saved at: {Path('runs/train/exp/weights/best.pt')}")


if __name__ == '__main__':
    train()
