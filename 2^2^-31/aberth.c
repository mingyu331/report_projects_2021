#include <stdio.h>
#include <stdlib.h>
#include <signal.h>

#include <gmp.h>
#include <mpfr.h>

// #define PREC INT_MAX
#define ITERATIONS 100

FILE* result_file;
mpfr_t val, tmp, tmp2;
int prev_prev_digits = -1, prev_digits = -1, current_digits = 0;

void exitHandler() {
    printf("exiting\n");
    mpfr_clears(val, tmp2, tmp, (mpfr_ptr) 0);
    fclose(result_file);
    exit(-1);
}

int main() {
    signal(SIGINT, exitHandler);
    // freopen("result_aberth.txt", "w", stdout);
    result_file = fopen("result_aberth.txt", "w");

    mpfr_inits2(PREC, val, tmp, tmp2, (mpfr_ptr) 0);
    mpfr_set_str(val, "1", 10, MPFR_RNDN);

    for (int i = 0; i < ITERATIONS; ++i) {
        // tmp = f(n)/f'(n)
        mpfr_set(tmp, val, MPFR_RNDN);
        mpfr_set(tmp2, val, MPFR_RNDN);
        mpfr_div_ui(tmp, tmp, 2147483648, MPFR_RNDN);
        mpfr_pow_ui(tmp2, tmp2, 2147483647, MPFR_RNDN);
        mpfr_mul_ui(tmp2, tmp2, 1073741824, MPFR_RNDN);
        mpfr_ui_div(tmp2, 1, tmp2, MPFR_RNDN);
        mpfr_sub(tmp, tmp, tmp2, MPFR_RNDN);

        // tmp = (f(n)/f'(n))/(1-f(n)/(2*f'(n)*n)) = w_n;
        mpfr_set(tmp2, val, MPFR_RNDN);
        mpfr_mul_ui(tmp2, tmp2, 2, MPFR_RNDN);
        mpfr_div(tmp2, tmp, tmp2, MPFR_RNDN);
        mpfr_ui_sub(tmp2, 1, tmp2, MPFR_RNDN);
        mpfr_div(tmp, tmp, tmp2, MPFR_RNDN);

        // update
        mpfr_sub(val, val, tmp, MPFR_RNDN);
        
        // print calculated digits
        mpfr_abs(tmp, tmp, MPFR_RNDN);
        mpfr_log10(tmp, tmp, MPFR_RNDN);
        mpfr_neg(tmp, tmp, MPFR_RNDN);
        current_digits = mpfr_get_si(tmp, MPFR_RNDD);
        if (current_digits == prev_prev_digits) {
            mpfr_printf("Calculation finished, calculated to %.0RDf digits\n", tmp);
            break;
        }
        prev_prev_digits = prev_digits;
        prev_digits = current_digits;
        mpfr_printf("%d: Calculated to around %.0RDf digits\n", i + 1, tmp);
    }
    // mpfr_printf("The result was calculated to %.0RDf digits\n", tmp);
    // print result
    mpfr_out_str(result_file, 10, 0, val, MPFR_RNDN);
    mpfr_clears(val, tmp2, tmp, (mpfr_ptr) 0);
    fclose(result_file);
    return 0;
}