digits_to_calculate = 256

import decimal
import time

def shift(root: decimal.Decimal) -> decimal.Decimal:
    constant = (root ** 2147483648 - 2) / (2147483648 * root ** 2147483647)
    return constant / (1 - constant * 1 / (2 * root))

def main():
    ctx = decimal.getcontext()
    # file = open(".\\Python\\2^2^-31\\result.txt", "w")
    root = decimal.Decimal(1)
    digits_prev = 0
    for _ in range(digits_to_calculate):
        current_shift = shift(root)
        root = root - current_shift
        if (-current_shift.__abs__().log10() > digits_prev):
            digits = -current_shift.__abs__().log10().__floor__()
            digits_prev = digits
            ctx.prec = digits + 32
            if (digits >= digits_to_calculate):
                print(str(root)[:digits_to_calculate])
                # file.write(str(root)[:digits_to_calculate])
                # file.close()
                return
    # file.close()
    print("Not enough precision. Calculated value:")
    print(str(root)[:digits_to_calculate])
    return

if __name__ == "__main__":
    start = time.time()
    main()
    end = time.time()
    print(f"Time took: {end - start}")
